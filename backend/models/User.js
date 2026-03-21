import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema =  mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, unique : true, required : true, lowercase : true, trim : true},
    password : {type : String,required : true,  minlength : 6, select : false},
    role : {type : String, enum:['admin', 'user'], default : 'user'},
    status : {type : String, enum:['active', 'inactive'], default : "active"}
}, {timestamps : true})

userSchema.pre("save", async function(next){
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = mongoose.model("User", userSchema)

export default User;