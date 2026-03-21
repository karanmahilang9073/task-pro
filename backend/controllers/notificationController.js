import { asynchandler } from "../middleware/asynchandler.js";
import Notification from "../models/Notification.js";

export const createNotification = asynchandler(async(req, res) => {
    const {recipient, type, taskId, message} = req.body
    if(!recipient || !type || !taskId || !message) {
        const error = new Error('all fields are required')
        error.statusCode = 400
        throw error
    } 
    const notification = new Notification({recipient, type, taskId, message})
    await notification.save()
    res.status(201).json({success : true, message : 'notification created successfully', notification})
})

export const getAllNotifications = asynchandler(async(req, res) => {
    const userId = req.userId;
    const notifications = await Notification.find({recipient : userId}).sort({createdAt : -1})
    if(notifications.length === 0){
        res.status(200).json({success : true, count : 0, notifications : []})
    }
    res.status(200).json({success : true, count : notifications.length, notifications : notifications})
})

export const getNotification = asynchandler(async(req, res) => {
    const notificationId = req.params.id
    const userId = req.userId
    const notification = await Notification.findById(notificationId)
    if(!notification){
        const error = new Error('notification not found')
        error.statusCode = 404
        throw error
    }
    if(notification.recipient.toString() !== userId){
        const error = new Error('you are not authorized to get notification access')
        error.statusCode = 403
        throw error
    }
    res.status(200).json({success : true, notification})
})

export const deleteNotification = asynchandler(async(req, res) => {
    const userId = req.userId
    const notificationId = req.params.id
    const notification = await Notification.findById(notificationId)
    if(!notification){
        const error = new Error('notification not found')
        error.statusCode = 404
        throw error
    }
    if(notification.recipient.toString() !== userId){
        const error = new Error('you are not authorized to delete this notification')
        error.statusCode = 403
        throw error
    }

    await Notification.findByIdAndDelete(notificationId)

    res.status(200).json({success : true, message : 'notification deleted successfully'})
})