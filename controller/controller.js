const User = require('../model/user.model'); // Assuming you have a User model defined in models/user.js


const home = (req, res)=>{
    res.send("Welcome to the User Management API!");
}

const signup = async (req, res)=>{
    try{
    const userData = req.body; // this will contain the data sent by the client
    
    // const user = new User(userData);
    // user.save();

    const user = await User.create(userData);


    // res.send(`User ${user} signed up successfully!`);
    //string
    res.json({
        message: `User ${user.email} signed up successfully!`,
        user: user
    });
}
catch(err){
    console.error("Error during signup:", err);
    res.status(500).json({
        message: "An error occurred during signup. Please try again later.",
        error: err.message
    });
}
}


module.exports = {
    home,
    signup
};