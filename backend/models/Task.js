import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title : {type : String, required : true, trim : true},
    description : {type : String},
    status : {type : String, enum:['pending','inprogress', 'completed', 'deadlineMissed'], default : 'pending'},
    createdBy : {type : mongoose.Types.ObjectId, ref : "User", required : true},
    deadline : {type : Date, index : true},
    team : {type : mongoose.Types.ObjectId, ref : "Team"},
    assignedTo : {type : mongoose.Types.ObjectId, ref : "User", required : true}
}, {timestamps : true})

taskSchema.index({assignedTo : 1, status : 1})

const Task = mongoose.model("Task", taskSchema)

export default Task;