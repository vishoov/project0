//user management api
const express = require('express');
const app = express();
const PORT = 3000;



app.get("/", (req, res)=>{
    res.send("Welcome to the User Management API!");
})

// signup -> post -> /signup /register -> user data databse save
app.post("/signup", (req, res)=>{
    const userData = req.body; // this will contain the data sent by the client
    console.log("User Data:", userData);
    res.send("User signed up successfully.");
});

// login -> post


// change password put


// logout get



app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})