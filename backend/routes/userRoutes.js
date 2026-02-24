import express from 'express'
import { deleteUser, getUser, login, register, updateUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login',  login)
userRouter.get('/profile',authMiddleware, getUser)
userRouter.put('/profile', authMiddleware, updateUser)
userRouter.delete('/profile', authMiddleware, deleteUser)

export default userRouter;