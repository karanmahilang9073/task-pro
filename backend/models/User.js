import mongoose from "mongoose";

const userSchema =  mongoose.Schema({
    name : {type : String,},
    email : {type : String, unique : true, required : true},
    password : {type : String, minlength : 6},
    role : {type : String, enum:['admin', 'user'], default : 'user'},
    status : {type : String, enum:['active', 'inactive']}
}, {timestamps : true})

const User = new mongoose.model("User", userSchema)

export default User;