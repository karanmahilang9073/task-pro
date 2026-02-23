import { asynchandler } from "../middleware/asynchandler.js";
import bcrypt from 'bcrypt'
import User from '../models/User.js'

export const register = asynchandler(async (req, res, next) => {
    const {name, email, password} = req.body 
    if(!name || !email || !password){
        const error = new Error('all fields are required')
        error.statusCode = 400
        throw error
    }

    const existeduser = await User.findOne({email})
    if(existeduser){
        const error = new Error('user aleady existed')
        error.statusCode = 409
        throw error
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({name, email, password : hashedPassword})
    user.save()

    res.status(200).json({success : true, message : 'user created successfully', user})
})

