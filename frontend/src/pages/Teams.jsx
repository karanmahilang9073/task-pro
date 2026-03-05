import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/authContext'
import { teamApi } from '../api/api'

function Teams() {

  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormdata] = useState({
    name : '',
    description : ''
  })

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
           <div className='flex flex-col'>
            <label className='w-full max-w-md rounded-md ' >team</label>
            <input type="text" value={formData.name} onChange={(e) => setFormdata({...formData, name : e.target.value})} placeholder='enter team name' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
           </div>
           <div className='flex flex-col'>
            <label className='w-full max-w-md rounded-md ' >team</label>
            <input type="text" value={formData.description}  onChange={(e) => setFormdata({...formData, description : e.target.value})} placeholder='enter team description' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
           </div>
           <div className="flex mt-2">
            <button type='submit' className='bg-blue-500 text-white ml-1.5 rounded m-2'>create team</button>
            <button type='button' onClick={() => setShowForm(false)} className='bg-gray-500 text-white ml-1.5 rounded'>cancel</button>
           </div>

          </form>
        )}

        {/* teams list  */}
        <div className='mt-4 bg-gray-300'>
          {teams.map((team) => (
              <div key={team._id} >
                <div className="mb-3">{team.name}</div>
                <div className='mb-3'>{team.description}</div>
              </div>
          ))}
        </div>
    </div>
  )
}

export default Teams
