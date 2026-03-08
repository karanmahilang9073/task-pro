import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import userRouter from './routes/userRoutes.js'
import taskRouter from './routes/taskRoutes.js'
import teamRouter from './routes/teamRoutes.js'
import notificationRouter from './routes/notificationRoutes.js'
import { startDeadlineChecker } from './utils/deadlinechecker.js'


const app = express()
dotenv.config()

app.use(express.json())
app.use(helmet())
app.use(cors())


const PORT = process.env.PORT

//basic server
app.get('/', (req, res) =>  {
    res.send('backend working fine')
})

//routes
app.use('/api/auth', userRouter)
app.use('/api/tasks', taskRouter)
app.use('/api/teams', teamRouter)
app.use('/api/notification', notificationRouter)

//database call
connectDB()

//start deadline checker
startDeadlineChecker()

//global error hander
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    console.log('error', err)
    res.status(statusCode).json({success : false, message : err.message  || 'internal server error'})
})

app.listen(PORT, () => {
    console.log(`server is running on port:${PORT}`)
})