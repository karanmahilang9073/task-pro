import express from 'express'
import { createTask, deleteTask, getAllTasks, getTask, updateTask } from '../controllers/taskController.js'
import authMiddleware from '../middleware/auth.js'

const taskRouter = express.Router()

taskRouter.post('/create-task', authMiddleware, createTask)
taskRouter.get('/',authMiddleware, getAllTasks)
taskRouter.get('/:id', authMiddleware, getTask)
taskRouter.put('/:id', authMiddleware, updateTask)
taskRouter.delete('/:id', authMiddleware, deleteTask)

export default taskRouter