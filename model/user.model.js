const mongoose = require('mongoose');

//mongoose.schema -> this is a method of mongoose that is used to create a schema for a collection in the database
// A schema defines the structure of the documents within a collection, including the fields and their types.
const userSchema = new mongoose.Schema({
    name:{
        type:String,// this field is of type String
        required:true, // this field is required, meaning it must be provided when creating a new document
        trim: true, // this will remove any leading or trailing whitespace from the string
        minLength:3, // this will ensure that the name is at least 3 characters long
        maxLength:50 // this will ensure that the name is at most 50 characters long
    },
    age:{
        type:Number,//number
        min:18, //age>18
        max:100, //age<100
        required:true//required 

    },
    email:{
        type:String,
        required:true,
        unique:true, //this will ensure that the email is unique across all documents in the collection
        // this will ensure that the email is in a valid format
        validate:{
            validator: function(v){
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        },
        trim:true,
        lowercase:true //this will ensure that the email is stored in lowercase

        //vishoo@acciojob.com
        //vishoo@.com
        //vishoo@accojob
        //vishoo.com@
        // vishooacciojobcom
    },
    password:{
        type:String,
        required:true,
        minLength:8, //this will ensure that the password is at least 8 characters long
        maxLength:20, //this will ensure that the password is at most 20 characters long
        validate:{ 
            validator: function(v){

                return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}/.test(v);
                //this regex will ensure that the password contains at least one lowercase letter, one uppercase letter, one digit, and one special character

            },

            message: props => `${props.value} does not meet all requirement`
        }
        
    },
    role:{
        type:String,
        enum: ['user', 'admin', 'seller', 'superadmin'], //this will ensure that the role is one of the specified values
        default: 'user' //this will set the default role to 'user' if no role is provided
    }
}, 
{
    timestamps: true //this will automatically add createdAt and updatedAt fields to the schema
});


//user management api
//ecommerce 
//roles -> user 
//admin -> controls the entire application
//seller -> can add products, manage orders, etc.
//superadmin -> can manage users, products, orders, etc.

const User = mongoose.model("User", userSchema);

module.exports = User;  // Exporting the User model


//this will create a model for the user schema, which can be used to interact with the users collection in the database