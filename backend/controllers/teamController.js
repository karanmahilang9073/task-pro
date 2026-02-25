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

export const updateTeam = asynchandler(async(req, res) => {
    const teamId = req.params.id
    const userId = req.userId
    const {name, description} = req.body

    const team = await Team.findById(teamId)
    if(!team){
        const error = new Error('team not found')
        error.statusCode = 404
        throw error
    }
    if(team.createdBy.toString() !== userId){
        const error = new Error('not authorized to update team')
        error.statusCode = 403
        throw error
    }
    if(name) team.name = name
    if(description) team.description = description

    await team.save()

    res.status(200).json({success : true, message : 'team updated successfully', team})
})

export const deleteTeam = asynchandler(async(req, res) => {
    const teamId = req.params.id
    const userId = req.userId

    const team = await Team.findById(teamId)
    if(!team){
        const error = new Error('team not found')
        error.statusCode = 404
        throw error
    }
    if(team.createdBy.toString() !== userId){
        const error = new Error('not authorized to delete team')
        error.statusCode = 403
        throw error
    }

    await Team.findByIdAndDelete(teamId)

    res.status(200).json({success : true, message : 'team deleted successfully'})
})

export const addMember = asynchandler(async(req, res) => {
    const teamId = req.params.id
    const userId = req.userId
    const {memberId} = req.body

    const team = await Team.findById(teamId)
    if(!team){
        const error = new Error('team not found')
        error.statusCode = 404
        throw error
    }
    if(team.createdBy.toString() !== userId){
        const error = new Error('not authorized to add members')
        error.statusCode = 403
        throw error
    }
    if(team.members.includes(memberId)){
        const error = new Error('member already exists in the team')
        error.statusCode = 400
        throw error
    }

    team.members.push(memberId)

    await team.save()

    res.status(200).json({success : true, message : 'new member added successfully', team})
})