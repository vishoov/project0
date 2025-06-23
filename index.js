//user management api
const express = require('express');
const app = express();
const PORT = 3000;
const userRoutes = require('./view/routes.view'); // Importing user routes
const rateLimit = require('express-rate-limit'); // Importing rate limiting middleware
app.use(express.json()); // Middleware to parse JSON bodies
const mongoose = require('mongoose');


//Uniform Resource Identifier
// Connect to MongoDB
mongoose.connect("mongodb+srv://vverma971:quaMPyDiE1usE2Nm@cluster0.dczxav0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("Connected to MongoDB successfully");
})
.catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
})

//promise to connect to the database


const middleware= (req, res, next)=>{
   
    //this middleware is going to be a logging middleware
    //logging middlewares means that we are going to log the request data, to keep a track of the requests made to the server
    const route = req.originalUrl; //this will give us the route that was accessed
    const method = req.method; //this will give us the method that was used to access the route
    const time = new Date().toLocaleString(); //this will give us the current time in a readable format

    console.log(`Route: ${route}, Method: ${method}, Time: ${time}`);


    next(); //this is a callback function that tells express that this middleware has completed its task and the next middleware or route handler can be called
    
    //return value 
}


//write the Rate Limiting Middleware





//universal middleware
//this middleware will be called for every request made to the server in the routes that are defined after this middleware
app.use(middleware);
app.use('/', userRoutes); // Using user routes for all requests starting with '/'

//ecommerce 
//user routes
//product routees
//order routes
//review routes



app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})