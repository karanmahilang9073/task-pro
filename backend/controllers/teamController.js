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

export const getAllTeams = asynchandler(async(req, res) => {
    const userId = req.userId
    const team = await Team.find({createdBy : userId})
    if(!team || team.length == 0){
        const error = new Error('team not found')
        error.statusCode = 404
        throw error
    }

    res.status(200).json({success : true, count : team.length, teams : team})
})

export const getTeam = asynchandler(async(req, res) => {
    const teamId = req.params.id 
    const userId = req.userId

    const team = await Team.findById(teamId)
    if(!team){
        const error = new Error('team not found')
        error.statusCode = 404
        throw error
    }
    if(team.createdBy.toString() !== userId){
        const error = new Error('not authorized to access team')
        error.statusCode = 403
        throw error
    }

    res.status(200).json({success : true, message : 'team fetched successfully', team})
})