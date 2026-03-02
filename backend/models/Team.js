import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name : {type : String},
    description : {type : String},
    members : [{type : mongoose.Types.ObjectId, ref : "User"}],
    createdBy : {type : mongoose.Types.ObjectId, ref : "User"},
    status : {type : String, enum : ['active','inactive'], default : 'active'}
},  {timestamps : true})

const Team = new mongoose.model("Team", teamSchema)
export default Team