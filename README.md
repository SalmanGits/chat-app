# Project Title

Real Time Chat App


## Endpoints

### GET /

- **Description**: Home page of the application
- **Method**: GET
- **Headers**: token
- **Response**: USER

### POST /api/chat-rooms

- **Description**: create a room
- **Method**: POST
- **Request**: JSON
- **Response**: JSON
-- **Headers**: token
-- **Body**: name,description

### POST api/chat-rooms/:roomId/join

- **Description**: join a room
- **Method**: POST
- **Response**: JSON
-- **Headers**: token
-- **params**: roomId
### POST api/chat-rooms/:roomId/leave

- **Description**: leave a room
- **Method**: POST
- **Response**: JSON
-- **Headers**: token
-- **params**: roomId


## Installation

```bash
$ git clone https://github.com/your-username/your-project.git
$ cd your-project
$ npm install
$ node server.js