//whenever we write routes in files except index.js
//we need to use the express.Router() method to create a new router object
const router = require('express').Router();
const { home, signup } = require('../controller/controller');
const User = require('../model/user.model'); // Importing the User model
const { createToken, authenticate } = require('../middlewares/auth.middleware'); // Importing the createToken function for JWT
const xss = require('xss'); // Importing xss for sanitizing input
router.get("/", authenticate, home)

// signup -> post -> /signup /register -> user data databse save
router.post("/signup", signup);

// login -> post
router.post('/login', async (req, res)=>{
try{
  const {email, password} = req.body;


  //sanitize the input to prevent XSS attacks
  email = xss(email);
  password = xss(password);


  //xss -> cross site scripting
  //xss -> is a type of attack where the attacker injects malicious scripts into a web page
  //this xss(input) function will sanitize the input by removing any malicious scripts
  

  //email -> script that will try to steal the data 

  //we find the user by email
  const user = await User.findOne({ email:email });

//in case of User.find all the users will be returned as an array
  //if user is not found, we return an error message
  if(!user){
    return res.status(404).send("User not found. Please sign up first.");
  }

  //compare the password
  const isPasswordValid = user.comparePassword(password);

  //if user is found, we check if the password matches
  if(!isPasswordValid){
    return res.status(401).send("Incorrect password. Please try again.");
  }

  const token = createToken(user); // Create a JWT token for the user



  //if password matches, we return a success message
  res.status(200).json({
    message: "Login successful",
    user:user,
    token: token // Return the JWT token
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


  //this process is called input sanitization 
  email = xss(email);
  oldpassword = xss(oldpassword);
  newpassword = xss(newpassword);

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


router.get("/activeusers", async (req, res)=>{
  try{
    const activeUsers = await User.aggregate([
      {
        $match:{
          isActive: true // Match only active users
        }
      }
    ])

    if(activeUsers.length === 0){
      return res.status(404).send("No active users found.");
    }

    res.status(200).json({
      message: "Active users fetched successfully",
      activeUsers: activeUsers
    });
  }
  catch(err){
    console.error("Error fetching active users:", err);
  }
})

//get users in india that are older than 18
router.get("/usersinindia", async (req, res)=>{
    try{
        const usersInIndia = await User.aggregate([
          
          
           {
            $match:{
              country:"India", 
              age: { $gt: 18 }, // Match users older than 18,
              isActive: true, // Ensure users are active
              email: { $exists: true } // Ensure email exists and is not empty
            }
          }
          
          
        ])

        res.status(200).json({
          message: "Users in India older than 18 fetched successfully",
          users: usersInIndia
        })
    }
    catch(err){
      console.error("Error fetching users in India:", err);
      res.status(500).json({
        message: "An error occurred while fetching users in India.",
        error: err.message
      });
    }
  
})

//get the count of users in each country
//india -> 2 
//USA -> 4
//UK  -> 3

//group the data based on country 
//india -> 
//USA ->
//UK ->

//then we count the number of users in each country

router.get("/usercountbycountry", async (req, res)=>{
  try{
    const userCountByCountry = await User.aggregate([
      {
        $group:{
          _id: "$country", // Group by country
          count:{
            $sum:1 // Count the number of users in each country
            //operations -> $sum, $avg, $min, $max, $push, $addToSet, $first, $last, $count  
            //Truthy-> 1
            // Falsy -> 0
          }
        }
      },{
        $project:{
          country: "$_id", // Rename _id to country
          _id:0,
          count: 1 // Include the count field
        }
      },
      {
        $sort:{
          count:-1

          //sort:-1 // Sort by count in descending order
          //sort:1 // Sort by count in ascending order
        }
      },{
        $limit: 10 // Limit the results to the top 2 countries by user count
      },{
        $skip:1
      }
    ])

    res.status(200).json({
      message: "User count by country fetched successfully",
      userCount: userCountByCountry
    });
    
  }
  catch(err){
    console.error("Error fetching user count by country:", err);
    res.status(500).json({
      message: "An error occurred while fetching user count by country.",
      error: err.message
    });
  }
})


//get the count of Active and Inactive users
//Active Users -> 5
//Inactive Users -> 3

router.get("/usercountbystatus", async (req, res)=>{
  try{
    const userCountByCountry = await User.aggregate([
      {
        $group:{
          _id: "$isActive", // Group by country
          count:{
            $sum:1 // Count the number of users in each country
            //operations -> $sum, $avg, $min, $max, $push, $addToSet, $first, $last, $count  
            //Truthy-> 1
            // Falsy -> 0
          }
        }
      }
    ])

    res.status(200).json({
      message: "User count by country fetched successfully",
      userCount: userCountByCountry
    });
    
  }
  catch(err){
    console.error("Error fetching user count by country:", err);
    res.status(500).json({
      message: "An error occurred while fetching user count by country.",
      error: err.message
    });
  }
})

//group the data based on  roles 
//admin -> 2
//user -> 4
//superadmin -> 3
router.get("/usercountbyrole", async (req, res)=>{
  try{
    const userCountByRole = await User.aggregate([
      {
        $group:{
          _id: "$role", // Group by role
          count:{
            $sum:1 // Count the number of users in each role
            //operations -> $sum, $avg, $min, $max, $push, $addToSet, $first, $last, $count
          }
        }
      },
      {
        $project:{
          role: "$_id", // Rename _id to role
          _id: 0, // Exclude _id from the output
          count: 1 // Include the count field
        }
      }
    ])

    res.status(200).json({
      message: "User count by role fetched successfully",
      userCount: userCountByRole
    });
  }
  catch(err){
    console.error("Error fetching user count by role:", err);
    res.status(500).json({
      message: "An error occurred while fetching user count by role.",
      error: err.message
    });
  }
});


router.get("/usercountbyage", async(req, res)=>{
  try{
    const userCount = await User.aggregate([
      {
        $group: {
          _id: "$age", // Group by age
          count: { $sum: 1 } // Count the number of users for each age

      }
    },
    {
      $project: {
        age: "$_id", // Rename _id to age

        _id: 0, // Exclude _id from the output
        count: 1 // Include the count field
      }
    }
    ])

    res.status(200).json({
      message: "User count by age fetched successfully",
      userCount: userCount
    });
  }
  catch(err){
    console.error("Error fetching user count by age:", err);
    res.status(500).json({
      message: "An error occurred while fetching user count by age.",
      error: err.message
    });
  }
})
// role- id
//count - number of users in that roles
//project-> role, count 


module.exports = router;