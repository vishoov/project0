const express = require('express');
//this imports the express module

//set up the express app = server 
const app = express();
//this creates an instance of the express application
//now we have to deploy the server to a port
//set up the port
const port = 3000;

//express.json() is a middleware that parses incoming JSON requests and puts the parsed data in req.body

//this is a pre-built middleware in express
//universal middleware 
app.use(express.json());
//this tells the express app to use the express.json() middleware


const root = function (req, res) {
    //send index.html
    res.sendFile(__dirname + '/index.html');
    //__dirname is a global variable that gives the current directory of the file
    //res.sendFile is a method that sends a file as a response
    
}


// app.method('route', handlerfunction)
//root route -> / -> localhost:3000
//profile -> /profile -> localhost:3000/profile
app.get('/', root)

app.get('/profile', (req, res) => {
    //profile related data will be sent here
    res.send("This is the profile route.");
})





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
//universal middleware
//this middleware will be called for every request made to the server in the routes that are defined after this middleware
app.use(middleware);


app.get('/about', middleware, (req, res) => {
    //about related data will be sent here
    console.log("About route accessed.");
    res.send("This is the about route.");
})

app.get("/post", (req, res)=>{
    //this is a GET request to the /post route
    res.send("This is a POST request to the social media Post route.");
})
// req-> methods, data, headers, etc
// res -> response, status code, headers, etc


//lets implement a POST route to get data from the client
//signup
//data input json file server send 

app.post("/signup", (req, res)=>{
    const userData = req.body; //this will contain the data sent by the client
    console.log("User Data:", userData);
    res.send("User signed up successfully.");
})

//json -> header -> content-type: application/json, authorisation, file type, encoding etc
//body -> data sent by the client
















//implement //a GET request to the /profile route


//function -> intialize and then implement whenever i call it


//port listener provided by express


//app.method('route', handlerfunction) -> simple 
//advanced routing 
//Route Parameters
//profile pages, product pages, etc


//localhost:3000/profile/vickykaushal
app.get('/profile/:username', (req, res)=>{
    const username = req.params.username;
    
    res.send(`This is the profile page of ${username}.`);

})


//product route 
//localhost:3000/product/:productName




//Query Parameters 
//searching for something 
app.get("/search", (req, res)=>{
    const query = req.query.q; //q is the query parameter
    const sort = req.query.sort; //sort is the query parameter
    const limit = req.query.limit; //limit is the query parameter
    res.send(`You searched for: ${query}, sorted by: ${sort}, with a limit of: ${limit}.`);
})

//localhost:3000/search?q=react&sort=asc&limit=10




//youtube -> millions of videos -> cannot make millions of routes
//dynamic routing -> format of the route -> data 


//amazon.in -> products -> millions of products

//https://www.youtube.com/results?search_query=react+tutorial
//youtube -> search query -> react tutorial



//app.method 
app.listen(
    port,
    () => console.log(`Server is running on port ${port}`)
)

