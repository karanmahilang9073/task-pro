import { asynchandler } from "../middleware/asynchandler.js";
import Task from "../models/Task.js";
import User from "../models/User.js";


export const createTask = asynchandler(async(req, res, next) => {
    const {title,description,deadline,assignedTo}= req.body;
    if(!title){
        const error = new Error('title is missing')
        error.statusCode = 400
        throw error
    }
    const status = 'pending'

    if(assignedTo){
        const userExist = await User.findById(assignedTo)
        if(!userExist){
            const error = new Error('user not found')
            error.statusCode = 404
            throw error
        }
    }
    const task = new Task({title, description,status, deadline, assignedTo})
    await task.save()
    res.status(201).json({success : true, message : 'task created successfully',
        task : {
            title : task.title,
            description : task.description
        }
    })
})

export const getAllTasks = asynchandler(async(req, res, next) => {
    
})