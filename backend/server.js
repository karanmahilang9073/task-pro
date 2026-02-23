import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.js'

const app = express()
dotenv.config()

app.use(express.json())

const PORT = process.env.PORT

//basic server
app.get('/', (req, res) =>  {
    res.send('backend working fine')
})

//database call
connectDB()

//global error hander
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    console.log('error', err)
    res.status(statusCode).json({success : false, message : err.message  || 'internal server error'})
})

app.listen(PORT, () => {
    console.log(`server is running on port:${PORT}`)
})