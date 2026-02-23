import { asynchandler } from "../middleware/asynchandler.js";
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import JWT from 'jsonwebtoken'

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

export const login = asynchandler(async(req, res, next) => {
    const {email, password} = req.body
    if(!email || !password){
        const error = new Error('email and password required')
        error.statusCode = 400
        throw error
    }

    const user = await  User.findOne({email})
    if(!user){
        const error = new Error('invalid email or password')
        error.statusCode = 401
        throw error
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        const error = new Error('password do not match')
        error.statusCode = 401
        throw error
    }

    const token = JWT.sign(
        {id : user._id},
        process.env.JWT_SECRET,
        {expiresIn : '10d'}
    )

    res.status(200).json({success : true, message : 'user logged in successfully', 
        user : {
            id : user._id,
            name : user.name,
            email : user.email
        }
    })
})