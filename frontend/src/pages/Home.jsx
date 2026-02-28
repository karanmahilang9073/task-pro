import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext.jsx'
import { useNavigate } from 'react-router-dom'
import { taskApi } from '../api/api'


function Home() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const {isLoggedin, logout, user, token} = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTask = async() => {
            try {
                setLoading(true)
                const data = await taskApi.getAllTasks()
                setTasks(data.tasks)
            } catch (error) {
                setError(error.response?.data?.message || 'failed to fetch task')
            }finally {
                setLoading(false)
            }
        }
        if(isLoggedin){
            fetchTask()
        }
    }, [isLoggedin, token])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

  return (
    <div className='min-h-screen bg-gray-300 p-6'>
        {/* header  */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
            <h1 className='text-xl font-semibold'>welcome, {user?.name}</h1>
            <button onClick={handleLogout} className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700'>logout</button>
        </div>

        {/* loading  */}
        {loading && <p className='text-gray-500'>loading</p>}

        {/* error */}
        {error && <p className='bg-red-500 text-white mb-4'>{error}</p>}

        {/* task list  */}
        {!loading && tasks.length == 0 && (
            <p className="text-gray-500">no task available</p>
        )}

        <div className='grid gap-4'>
            {tasks.map((task) => (
                <div key={task._id} className='bg-white p-4 rounded-lg shadow'>
                    <h2 className="font-semibold text-lg">{task.title}</h2>
                    <p className="text-gray-500">{task.description}</p>
                </div>
            ))}
        </div>

    </div>
  )
}

export default Home
