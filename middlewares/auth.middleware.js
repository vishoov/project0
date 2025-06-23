const jwt = require('jsonwebtoken');


const JWT_SECRET= process.env.JWT || 'Hellothisismysecretkey' // secret key for JWT, should be stored in environment variables in production

//jwt authentication 

//token create 
const createToken = (user)=>{
    //jwt consists of three parts: header, payload, and signature
    const token = jwt.sign(
        {
            id: user._id, // user id
            email: user.email, // user email
        
        },
        JWT_SECRET, // secret key from environment variables
        { expiresIn: '1000h' } // token expiration time
    );
    return token; // return the generated token
}

//authentication middleware
const authenticate = (req, res, next)=>{
    try{
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
        
        console.log("Token received:", token);

        if(!token){
            return res.status(401).json({
                message: "Unauthorized access. Please provide a valid token."
            });
        }
        // Verify the token
        const valid = jwt.verify(token, JWT_SECRET);
        if(!valid){
            return res.status(401).json({
                message: "Invalid token. Please provide a valid token."
            });
        }
        console.log("Token is valid:", valid);
        // If token is valid, attach user information to the request object
        req.user= {
            id: valid.id, // user id from token
            email: valid.email // user email from token
        }
        next();
    }
    catch(err){
        console.error("Error during authentication:", err);
        res.status(401).json({
            message: "Unauthorized access. Please provide a valid token.",
            error: err.message
        });
    }
}

module.exports = {
    createToken,
    authenticate
}