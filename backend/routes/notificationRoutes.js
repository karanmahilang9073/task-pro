import express from 'express'
import { createNotification, deleteNotification, getAllNotifications, getNotification } from '../controllers/notificationController.js'
import authMiddleware from '../middleware/auth.js'

const notificationRouter = express.Router()

notificationRouter.post('/create-notification', authMiddleware, createNotification)
notificationRouter.get('/', authMiddleware, getAllNotifications)
notificationRouter.get('/:id', authMiddleware, getNotification)
notificationRouter.delete('/:id', authMiddleware, deleteNotification)

export default notificationRouter