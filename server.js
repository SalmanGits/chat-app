const express = require('express');
const app = express();
const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ noServer: true });
const authenticate = require('./auth/firebaseauth');
app.use(express.json());
app.get('/', authenticate, (req, res) => {
  return res.status(201).json({ result: req.user })
})
const chatRooms = [];
app.post('/api/chat-rooms', authenticate, (req, res) => {
  const { name, description } = req.body;
  const participant = { user: req.user.name };
  const room = { id: generateRoomId(), name, description, participants: [participant], clients: [] };
  chatRooms.push(room);
  res.status(201).json(room);
});


app.post('/api/chat-rooms/:roomId/join', authenticate, (req, res) => {

  const roomId = req.params.roomId;
  const room = chatRooms.find((room) => room.id === roomId);
  if (!room) {
    return res.status(404).json({ message: 'Chat room not found' });
  }

  const participant = { user: req.user.name };
  room.participants.push(participant);
  res.json(room);
});


app.post('/api/chat-rooms/:roomId/leave', authenticate, (req, res) => {
  const roomId = req.params.roomId;
  const room = chatRooms.find((room) => room.id === roomId);
  if (!room) {
    return res.status(404).json({ message: 'Chat room not found' });
  }

  room.participants = room.participants.filter((participant) => participant.user !== req.user.name);

  res.json(room);
});




wsServer.on('connection', (ws, req) => {
  const roomId = req.url.substring(1);
  console.log(roomId);
  const room = chatRooms.find((room) => room.id === roomId);
  if (!room) {
    console.log('No room found')
    ws.close();
    return;
  }


  room.clients.push(ws);
  console.log(room)
  ws.on('message', (message) => {
    room.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {

    room.clients = room.clients.filter((client) => client !== ws);
  });
});


function generateRoomId() {
  return Math.random().toString(36).substring(2, 8);
}








const server = app.listen(3001, () => {
  console.log('Server started on port 3001');
});


server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (ws) => {
    wsServer.emit('connection', ws, request);
  });
});
