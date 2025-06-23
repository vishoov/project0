//user management api
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const userRoutes = require('./view/routes.view'); // Importing user routes
const rateLimit = require('express-rate-limit'); // Importing rate limiting middleware
app.use(express.json()); // Middleware to parse JSON bodies
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Importing dotenv to manage environment variables
dotenv.config();

const cors = require('cors'); // Importing CORS middleware

//Uniform Resource Identifier
// Connect to MongoDB
mongoose.connect(process.env.MONGO)
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
//middlewares -> have access to the request, response, and next function
//in order to identify the user, we can use the IP address of the user
//the IP address is present in the request object

const limiter = rateLimit(
    {
        windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
        max:100, // Limit each IP to 100 requests per windowMs
        message:"Too many requests from this IP, please try again after an hour", // Message to send when limit is reached
    }
)
//windowMs -> its the time window in which the requests are counted
//1 hour i want to allow only 100 requests from a single IP address


// Create a rate limiter from express-rate-limit

//implement any settings we use objects

app.use(limiter); // Apply the rate limiting middleware to all requests

//laptop IP address -> same 
const corsOptions = {
    origin: '*', //
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Should be false when origin is '*'
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions)); // Use CORS middleware with specified options


//fullstack application
//front end -> amazon.in or localhost:3000 or facebook.com //IP address or domain name
//backend 

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