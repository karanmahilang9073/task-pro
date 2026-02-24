import JWT from 'jsonwebtoken'
import { asynchandler } from './asynchandler.js'

const authMiddleware = asynchandler(async(req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        const error = new Error("no authHeader provided")
        error.statusCode = 401
        throw error
    }
    const token = authHeader.split(" ")[1]

    const decoded = JWT.verify(token, process.env.JWT_SECRET)

    const userId = decoded.id

    req.userId = userId

    next()
})

export default authMiddleware