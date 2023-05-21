const admin = require("./firebase.js");
const authenticate =async(req,res,next)=>{
  try {
     
      let token = req.headers.token
     let  data = await admin.auth().verifyIdToken(token);
     req.user = data
    if(data){
     
      next()
    }
  } catch (error) {
    console.log(error.message)
  }

}


module.exports = authenticate;
