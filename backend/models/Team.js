import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name : {type : String, required : true},
    description : {type : String},
    members : [{type : mongoose.Types.ObjectId, ref : "User", default : []}],
    createdBy : {type : mongoose.Types.ObjectId, ref : "User", required : true},
    status : {type : String, enum : ['active','inactive'], default : 'active'}
},  {timestamps : true})

const Team = mongoose.model("Team", teamSchema)
export default Team