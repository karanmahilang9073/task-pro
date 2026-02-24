import express from 'express'
import { createTask, getAllTasks } from '../controllers/taskController.js'
import authMiddleware from '../middleware/auth.js'

const taskRouter = express.Router()

taskRouter.post('/create-task', authMiddleware, createTask)
taskRouter.get('/',authMiddleware, getAllTasks)

export default taskRouter