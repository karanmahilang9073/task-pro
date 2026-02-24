import express from 'express'
import { createTask, getAllTasks, getTask } from '../controllers/taskController.js'
import authMiddleware from '../middleware/auth.js'

const taskRouter = express.Router()

taskRouter.post('/create-task', authMiddleware, createTask)
taskRouter.get('/',authMiddleware, getAllTasks)
taskRouter.get('/:id', authMiddleware, getTask)


export default taskRouter