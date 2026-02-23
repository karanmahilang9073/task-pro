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

app.listen(PORT, () => {
    console.log(`server is running on port:${PORT}`)
})