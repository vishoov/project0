//whenever we write routes in files except index.js
//we need to use the express.Router() method to create a new router object
const router = require('express').Router();
const { home, signup } = require('../controller/controller');
const User = require('../model/user.model'); // Importing the User model


router.get("/", home)

// signup -> post -> /signup /register -> user data databse save
router.post("/signup", signup);

// login -> post
router.post('/login', async (req, res)=>{
try{
  const {email, password} = req.body;

  //we find the user by email
  const user = await User.findOne({ email:email });

//in case of User.find all the users will be returned as an array
  //if user is not found, we return an error message
  if(!user){
    return res.status(404).send("User not found. Please sign up first.");
  }

  //if user is found, we check if the password matches
  if(user.password !== password){
    return res.status(401).send("Incorrect password. Please try again.");
  }

  //if password matches, we return a success message
  res.status(200).json({
    message: "Login successful",
    user:user
  })
}
catch(err){
  console.error("Error during login:", err);
  res.json({
    message: "An error occurred during login. Please try again later.",
    error: err.message
  });
}

})

// change password put
router.put('/changepassword', async (req, res)=>{

  const {email, oldpassword, newpassword} = req.body;

  const user = await User.findOneAndUpdate({
    email:email,
    password:oldpassword
  },
{
  password:newpassword
})

  if(!user){
    return res.status(404).send("User not found or old password does not match.");
  }

  const updatedUser = await User.findOne({ email:email });


  res.status(200).json({
    message: "Password changed successfully",
    user:updatedUser
  })

  //find the user by email 
  //check if oldpassword matches
  //update the password with newpassword

  res.send("passwrod change")

})

router.get("/allusers", async (req, res)=>{
    const users = await User.find();  

    res.status(200).json({
        message: "All users fetched successfully",
        users: users
    });
    
    })




// logout get
router.get("/logout", (req, res)=>{
    // clear the session or token
    res.send("User logged out successfully.");
});

module.exports = router;