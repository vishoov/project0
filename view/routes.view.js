//whenever we write routes in files except index.js
//we need to use the express.Router() method to create a new router object
const router = require('express').Router();
const { home, signup } = require('../controller/controller');

router.get("/", home)

// signup -> post -> /signup /register -> user data databse save
router.post("/signup", signup);

// login -> post
router.post('/login', (req, res)=>{

  const {email, password} = req.body;

  console.log("user LoginData:", email, password );

   res.send("User login successfully.");

})

// change password put
router.put('/changepassword', (req, res)=>{

  const{email, oldpassword, newpassword} = req.body;

  //find the user by email 
  //check if oldpassword matches
  //update the password with newpassword

  res.send("passwrod change")

})

router.get("/allusers", (req, res)=>{
    //this route will return all the users from the database
    //for now, we will just send a dummy response
    res.send("All users data will be sent here.");
})



// logout get
router.get("/logout", (req, res)=>{
    // clear the session or token
    res.send("User logged out successfully.");
});

module.exports = router;