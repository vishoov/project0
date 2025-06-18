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


router.get("/user/:name", async (req, res)=>{
  try{
    const userName = req.params.name;
    const response = await User.find({
      name:userName

    })

    if(response.length===0){
      return res.status(404).send("User not found.");
    }

    res.status(200).json({
      message: "User fetched successfully",
      user: response
    });
  }
  catch(err){
    console.error("Error fetching user:", err);
  }
});

//find users from a specific country
router.get("/country/:country", async (req, res)=>{
  try{
    const countryName = req.params.country;
    const users = await User.find({
      country: countryName

    })

    if(users.length===0){
      return res.status(404).send("No users found from this country.");
    }

    res.status(200).json({
      message: "Users from the specified country fetched successfully",
      users: users
    });
  }
  catch(err){
    console.error("Error fetching users by country:", err);
  }
})


router.get("/greaterthan/:age", async (req, res)=>{
  try{
    const age = parseInt(req.params.age, 10);
    const users = await User.find({
      age: {
        $gte: age
      }
    })

    res.status(200).json({
      message: "Users older than specified age fetched successfully",
      users: users
    });

  }
  catch(err){
    console.error("Error fetching users by age:", err);
  }
})


router.get("/lesserthan/:age", async (req, res)=>{
  try{
    const age = parseInt(req.params.age, 10);
    const users = await User.find({
      age: {
        $lt: age
      }
    })

    res.status(200).json({
      message: "Users older than specified age fetched successfully",
      users: users
    });

  }
  catch(err){
    console.error("Error fetching users by age:", err);
  }
})



router.get("/notequal/:age", async (req, res)=>{
  try{
    const age = parseInt(req.params.age, 10);
    const users = await User.find({
      age: {
        $ne:age
      }
    })

    res.status(200).json({
      message: "Users older than specified age fetched successfully",
      users: users
    });

  }
  catch(err){
    console.error("Error fetching users by age:", err);
  }
})

router.get("/logical/:country/:age", async (req, res)=>{
  try{
    const countryName = req.params.country;
    const age = parseInt(req.params.age, 10);

    const users = await User.find({
      $or:[
        {
          country:countryName
        },
        {
          age:age
        }
      ]
    })
    res.status(200).json({
      message: "Users from specified country and age fetched successfully",
      users: users
    });
  }
  catch(err){
    console.error("Error fetching users by country and age:", err);
  }
})

router.get("/notage/:age", async (req, res)=>{
  try{
    const age = parseInt(req.params.age, 10);
    const users = await User.find({
      $nor:[
       {
        age: age
       }
      ]
      
    })
    res.status(200).json({
      message: "Users not of specified age fetched successfully",
      users: users
    });
  }
  catch(err){
    console.error("Error fetching users not of specified age:", err);
  }
})


router.get("/range/:minAge/:maxAge", async (req, res)=>{
  try{
    const minAge = parseInt(req.params.minAge, 10);
    const maxAge = parseInt(req.params.maxAge, 10);
 
    const users = await User.find({
      // $and:[
      //   {
      //     age: { $gte: minAge }
      //   },
      //   {
      //     age: { $lte: maxAge }
      //   }
      // ]

      //active -> isActive
// age -> 18 
// country->  India 


      $age:{
        $gte: minAge,
        $lte: maxAge
      }
    })
    res.status(200).json({
      message: "Users within specified age range fetched successfully",
      users: users
    });
  }
  catch(err){
    console.error("Error fetching users by age range:", err);
  }
})

router.get("/query/:age", async (req, res)=>{
  try{
    const age = parseInt(req.params.age, 10);

    const users = await User.find({
      $and:[
        {
          age: { $gte: age }
        },
        {
          country: "India"
        },
        {
          isActive: true 
        }
      ]
    })

    res.status(200).json({
      message: "Users matching query criteria fetched successfully",
      users: users
    });
  }
  catch(err){
    console.error("Error fetching users by query:", err);
  }
})


//example for aggregation -> average age of users
router.get("/averageage", async (req, res)=>{
  try{
      const averageAgeUsers = await User.aggregate([
        {
          $group: {
        _id: null,
        averageAge: { $avg: "$age" }
          }
        },
        {
          $project: {
        _id: 0,
        averageAge: 1
          }
        }
      ])

      if(averageAgeUsers.length === 0){
        return res.status(404).send("No users found to calculate average age.");
      }

      res.status(200).json({
        message: "Average age calculated successfully",
        averageAge: averageAgeUsers // accessing the average age from the result
      });

  }
  catch(err){
    console.error("Error calculating average age:", err);
  }
})

module.exports = router;