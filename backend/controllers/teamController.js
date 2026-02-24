import { asynchandler } from "../middleware/asynchandler.js";
import Team from "../models/Team.js";


export const createTeam = asynchandler(async(req, res) => {
    const userId = req.userId
    const {name, description} = req.body 
    if(!name || name.trim() === "" ){
        const error = new Error('team name is required')
        error.statusCode = 400
        throw error
    }
    const newTeam = await new Team({
        name : name.trim(),
        description,
        createdBy : userId,
        members : [userId]
    })

    await newTeam.save()
    res.status(200).json({success : true, message : 'new team created successfully', newTeam})
})