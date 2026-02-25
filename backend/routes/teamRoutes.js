import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { addMember, createTeam, deleteTeam, getAllTeams, getTeam, removeMember, updateTeam } from '../controllers/teamController.js'

const teamRouter = express.Router()

teamRouter.post('/', authMiddleware, createTeam)
teamRouter.get('/', authMiddleware, getAllTeams)
teamRouter.get('/:id', authMiddleware, getTeam)
teamRouter.put('/:id', authMiddleware, updateTeam)
teamRouter.delete('/:id', authMiddleware, deleteTeam)
teamRouter.post('/:id/add-member', authMiddleware, addMember)
teamRouter.post('/:id/delete-member', authMiddleware, removeMember)


export default teamRouter