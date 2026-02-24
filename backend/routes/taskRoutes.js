import express from 'express'
import { createTask } from '../controllers/taskController.js'
import authMiddleware from '../middleware/auth.js'

const taskRouter = express.Router()

taskRouter.post('/create-task', authMiddleware, createTask)

export default taskRouter