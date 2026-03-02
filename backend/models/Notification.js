import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient : {type : mongoose.Types.ObjectId, ref : "User"},
    type : {type : String, enum : ['taskAssignment', 'deadline', 'completion',]},
    taskId : {type : mongoose.Types.ObjectId, ref : "Task"},
    message : {type : String},
}, {timestamps : true})

const Notification = new mongoose.model("Notification", notificationSchema)
export default Notification;