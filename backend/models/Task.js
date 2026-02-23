import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title : {type : String},
    description : {type : String},
    status : {type : String, enum:['pending','inProgress', 'completed', 'deadlineMissed']},
    deadline : {type : Date},
    team : {type : mongoose.Types.ObjectId, ref : "User"},
    assignedTo : {type : mongoose.Types.ObjectId, ref : "User"}
}, {timestamps : true})

const Task = new mongoose.model("Task", taskSchema)
export default Task;