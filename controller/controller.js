const home = (req, res)=>{
    res.send("Welcome to the User Management API!");
}

const signup = (req, res)=>{
    const userData = req.body; // this will contain the data sent by the client
    console.log("User Data:", userData);
    res.send("User signed up successfully.");
}


module.exports = {
    home,
    signup
};