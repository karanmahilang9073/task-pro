import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/authContext'
import { teamApi } from '../api/api'
import { toast } from 'react-toastify'

function Teams() {

  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormdata] = useState({
    name : '',
    description : ''
  })
  const [editTeamId, setEditTeamId] = useState(null)
  const [editFormdata, setEditFormdata] = useState({
    name : '',
    description : ''
  })

  const [addMemberTeamId, setAddMemberTeamId] = useState(null)
  const [newMemberId, setNewMemberId] = useState('')

  const {isLoggedin} = useContext(AuthContext)

  const fetchTeams = async() => {
    try {
      setLoading(true)
      const team = await teamApi.getAllTeams()
      setTeams(team.data.teams)
    } catch (error) {
      setError(error.response?.data?.message || 'failed to fetch teams')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(isLoggedin){
      fetchTeams()
    }
  }, [isLoggedin])

  const handleCreateTeam = async(e) => {
    try {
      e.preventDefault()
      await teamApi.createTeam(formData.name, formData.description)
      setFormdata({name : '', description : ''})
      setShowForm(false)
      fetchTeams()
    } catch (error) {
      setError(error.response?.data?.message || 'failed to create team')
    }
  }

  const handleEditTeam = async(team) => {
    setEditTeamId(team._id)
    setEditFormdata({
      name : team.name,
      description : team.description
    })
  }

  const handleUpdate = async(e) => {
    try {
      e.preventDefault()
      await teamApi.updateTeam(editTeamId, editFormdata.name, editFormdata.description)
      setEditFormdata({name : '', description : ''})
      fetchTeams()
      setEditTeamId(null)
    } catch (error) {
      setError(error.response?.data?.message || 'failed to update team')
    }
  }

  const handleDelete = async(teamId) => {
      try {
        await teamApi.deleteTeam(teamId)
        fetchTeams()
      } catch (error) {
        setError(error.response?.data?.message || 'failed to delete team')
      }
  }

  const handleAddMember = async(teamId) => {
    try {
      setError(null)
      if(newMemberId == ''){
        setError('member ID cannot be empty')
        return
      }
      await teamApi.addMembers(teamId, newMemberId)
      toast.success('member added successfully')
      setNewMemberId('')
      fetchTeams()
    } catch (error) {
      setError(error.response?.data?.message || 'failed to add members')
      toast.error('failed to add member')
    }
  }

  const handleRemoveMember = async(teamId, memberId) => {
    try {
      await teamApi.removeMember(teamId, memberId)
      fetchTeams()
    } catch (error) {
      setError(error.response?.data?.message || 'failed to remove member')
    }
  }

  return (
    <div>
      <h1 className='bg-gray-600 text-white text-center'>My teams</h1>

       {/* loading  */}
        {loading && <p className='bg-blue-50 border  border-blue-200 text-blue-600 text-sm rounded-lg px-3 py-2 mb-4'>fetching teams, please wait...</p>}

        {/* error */}
        {error && <p className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4'>{error}</p>}

        {/* task list  */}
        {!loading && teams.length == 0 && (
            <p className="text-gray-500">no teams available</p>
        )}

        {/* toggle create form button */}
        {!showForm && (
            <button onClick={() => setShowForm(true)} className='mb-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium mt-4'>+ Create team</button>
        )}

        {showForm && (
          <form onSubmit={handleCreateTeam} className='mt-3 m-5  rounded-lg border border-gray-500 p-3'>
            <h2 className='text-2xl ml-3.5 '>create a team..</h2>

            {/* team name */}
           <div className='flex flex-col'>
            <label className='w-full max-w-md rounded-md ' >team</label>
            <input type="text" value={formData.name} onChange={(e) => setFormdata({...formData, name : e.target.value})} placeholder='enter team name' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
           </div>

           {/* team desxription */}
           <div className='flex flex-col'>
            <label className='w-full max-w-md rounded-md ' >team</label>
            <input type="text" value={formData.description}  onChange={(e) => setFormdata({...formData, description : e.target.value})} placeholder='enter team description' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
           </div>

           {/* create team button */}
           <div className="flex mt-2">
            <button type='submit' className='bg-blue-500 text-white ml-1.5 rounded m-2'>create team</button>
            <button type='button' onClick={() => setShowForm(false)} className='bg-gray-500 text-white ml-1.5 rounded'>cancel</button>
           </div>

          </form>
        )}

        {editTeamId !==  null && 
        <form onSubmit={handleUpdate}>
          {/* edit team name */}
          <div className='flex flex-col'>
            <label className='w-full max-w-md rounded-md ' >team</label>
            <input type="text" value={editFormdata.name} onChange={(e) => setEditFormdata({...editFormdata, name : e.target.value})} placeholder='change team name' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
           </div>

           {/* edit team description */}
           <div className='flex flex-col'>
            <label className='w-full max-w-md rounded-md ' >team</label>
            <input type="text" value={editFormdata.description}  onChange={(e) => setEditFormdata({...editFormdata, description : e.target.value})} placeholder='change team description' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
           </div>

           {/* save button */}
           <div className="flex mt-2">
            <button type='submit' className='bg-blue-500 text-white ml-1.5 rounded m-2'>save</button>
            <button type='button' onClick={() => setEditTeamId(null)} className='bg-gray-500 text-white ml-1.5 rounded'>cancel</button>
           </div>
        </form>
        }

        {/* teams list  */}
        <div className='mt-4 bg-gray-300'>
          {teams.map((team) => (
              <div key={team._id} className='bg-white p-6 rounded-lg hover:shadow-md transition m-5 ' >
                <h2 className="font-semibold text-lg">{team.name}</h2>
                <p className='text-gray-600 mt-2'>{team.description}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEditTeam(team)} className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition'>edit</button>
                  <button onClick={() => handleDelete(team._id)} className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition'>delete</button>
                </div>

                {/* team mebers  */}
                <div className="mt-4">
                  <h3 className='font-semibold'>Team Members</h3>
                  {team.members && team.members.length > 0 ? (
                    team.members.map((memberId) => (
                      <div key={memberId} className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded mt-2">
                        <span>{memberId.name}</span>
                        <button onClick={() => handleRemoveMember(team._id, memberId._id)} className='bg-red-400 text-white px-3 py-1 rounded hover:bg-red-600'>remove </button>
                      </div>
                    ))
                  ) : (
                    <p className='text-gray-500 mt-1'>no members</p>
                  )}

                  {/* add members form  */}
                  <div className="flex gap-2 mt-3">
                    <input type="text" value={addMemberTeamId === team._id ? newMemberId : ''} onChange={(e) =>{ setAddMemberTeamId(team._id), setNewMemberId(e.target.value)}} placeholder='enter member id' className='border border-gray-300 px-3 py-2 rounded w-full' />
                    <button onClick={() => handleAddMember(team._id)} className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>add</button>
                  </div>
                </div>
              </div>
          ))}


          
        </div>
    </div>
  )
}

export default Teams
