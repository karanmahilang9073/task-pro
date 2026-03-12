import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import connectDB from './config/database.js'
import userRouter from './routes/userRoutes.js'
import taskRouter from './routes/taskRoutes.js'
import teamRouter from './routes/teamRoutes.js'
import notificationRouter from './routes/notificationRoutes.js'
import { startDeadlineChecker } from './utils/deadlinechecker.js'
import { deadlineReminder } from './utils/deadlineReminder.js'
import { sendEmail } from './services/emailService.js'

console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);

const app = express()

app.use(express.json())
app.use(helmet())
app.use(cors())


const PORT = process.env.PORT

//basic server
app.get('/', (req, res) =>  {
    res.send('backend working fine')
})

//test email endpoint
app.get('/test-email', async (req, res) => {
    try {
        const result = await sendEmail('karanmahilang05@gmail.com', 'Test Email', '<h1>Hello, this is a test email!</h1>')
        res.json({ success: true, message: 'Email sent successfully', result })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
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

//deadline reminder
deadlineReminder()

//global error hander
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    console.log('error', err)
    res.status(statusCode).json({success : false, message : err.message  || 'internal server error'})
})

app.listen(PORT, () => {
    console.log(`server is running on port:${PORT}`)
})