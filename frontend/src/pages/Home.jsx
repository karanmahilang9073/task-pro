import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext.jsx'
import { useNavigate } from 'react-router-dom'
import { taskApi } from '../api/api'


function Home() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    //task states
    const [formdata, setFormdata] = useState({
        title : '',
        description : '',
        deadline : ''
    })

    const {isLoggedin, logout, user, token} = useContext(AuthContext)
    const navigate = useNavigate()

    const fetchTask = async() => {
        try {
            setLoading(true)
            const data = await taskApi.getAllTasks()
            setTasks(data.data.tasks)
        } catch (error) {
            setError(error.response?.data?.message || 'failed to fetch task')
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(isLoggedin){
            fetchTask()
        }
    }, [isLoggedin, token])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleTask = async(e) => {
        e.preventDefault()
        try {
            await taskApi.createTask(formdata.title, formdata.description, formdata.deadline)
            setFormdata({title : '', description : '', deadline : ''})
            setError(null)
            await fetchTask()
        } catch (error) {
            setError(error.response?.data?.message || 'failed to create task, try again later')
        } finally {
            setLoading(false)
        }
    }

    const deleteTask = async(taskId) => {
        try {
            await taskApi.deleteTask(taskId)
            await fetchTask()
            setError(null)
            console.log('task deleted successfully', taskId)
        } catch (error) {
            setError(error.response?.data?.message || 'failed to delete task')
        }

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

         {/* create task  */}
        <form onSubmit={handleTask}>
            <div>
                <label className='bg-amber-200'>title</label>
                <input type="text" onChange={(e) => setFormdata({...formdata, title : e.target.value})} placeholder='enter task title' />
            </div>
            <div>
                <label className='bg-amber-200'>description</label>
                <input type="text" onChange={(e) => setFormdata({...formdata, description : e.target.value})} placeholder='please enter task description' />
            </div>
            <div>
                <label className='bg-amber-200'>deadline</label>
                <input type="date" onChange={(e) => setFormdata({...formdata, deadline : e.target.value})} placeholder='please set task deadline' />
            </div>
            <button type='submit' className='bg-blue-500'>ceate-task</button>
        </form>

        <div className='grid gap-4'>
            {tasks.map((task) => (
                <div key={task._id} className='bg-white p-4 rounded-lg shadow'>
                    <h2 className="font-semibold text-lg">{task.title}</h2>
                    <p className="text-gray-500">{task.description}</p>
                    <p className='text-gray-400'>{task.deadline}</p>
                    <button onClick={() => deleteTask(task._id)} className='bg-red-400 text-white'>delete task</button>
                </div>
            ))}
        </div>
        
       
    </div>
  )
}

export default Home
