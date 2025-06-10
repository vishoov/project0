const express = require('express');
//this imports the express module

//set up the express app = server 
const app = express();
//this creates an instance of the express application
//now we have to deploy the server to a port
//set up the port
const port = 3000;

const root = function (req, res) {
    res.send("Hello World! Welcome to my Express server.");
}


// app.method('route', handlerfunction)
//root route -> / -> localhost:3000
//profile -> /profile -> localhost:3000/profile
app.get('/', root)

app.get('/profile', (req, res) => {
    res.send("This is the profile route.");
})

app.get('/about', (req, res) => {
    res.send("This is the about route.");
})

app.post("/post", (req, res)=>{
    res.send("This is a POST request to the /post route.");
})
// req-> methods, data, headers, etc
// res -> response, status code, headers, etc


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



//Query Parameters 
//searching for something 
app.get("/search", (req, res)=>{
    const query = req.query.q; //q is the query parameter
    res.send(`You searched for: ${query}`);
})



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

