import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext.jsx'
import { useNavigate } from 'react-router-dom'
import { taskApi } from '../api/api'


function Home() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)

    //task states
    const [formdata, setFormdata] = useState({
        title : '',
        description : '',
        deadline : ''
    })
    
    //edit task states
    const [editTaskId, setEditTaskId] = useState(null)
    const [editFormData, setEditFormData] = useState({
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

    // create task
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

    //delete task
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

    //edit task
    const handleEditTask = async(task) => {
        setEditTaskId(task._id)
        setEditFormData({
            title : task.title || '',
            description : task.description || '',
            deadline : task.deadline || ''
        })
    }

    //update task
    const handleUpdateTask = async(e) => {
        try {
            e.preventDefault()
            await taskApi.updateTask(editFormData.title, editFormData.description, editFormData.deadline, null, editTaskId)
            setEditFormData({title : '', description : '', deadline : ''})
            await fetchTask()
            setEditTaskId(null)
        } catch (error) {
            setError(error.response?.data?.message || 'failed to updated task')
        }
    }

  return (
    <div className='min-h-screen bg-gray-300 p-6'>

        {/* header  */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
            <h1 className='text-2xl font-semibold text-gray-800'>welcome, <span className="text-blue-600">{user?.name}</span></h1>
            <button onClick={handleLogout} className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-medium'>logout</button>
        </div>

        {/* loading  */}
        {loading && <p className='bg-blue-50 border  border-blue-200 text-blue-600 text-sm rounded-lg px-3 py-2 mb-4'>loading</p>}

        {/* error */}
        {error && <p className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4'>{error}</p>}

        {/* task list  */}
        {!loading && tasks.length == 0 && (
            <p className="text-gray-500">no task available</p>
        )}

        {/* toggle create form button */}
        {!showForm && (
            <button onClick={() => setShowForm(true)} className='mb-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium'>+ Create Task</button>
        )}

         {/* create task  */}
        {showForm && (
        <form onSubmit={handleTask} className='bg-white p-6 rounded-lg shadow mb-6'>
            <h3 className='text-lg font-semibold mb-4'>create new task</h3>
            <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>title</label>
                <input type="text" value={formdata.title} onChange={(e) => setFormdata({...formdata, title : e.target.value})} placeholder='enter task title' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
            </div>
            <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>description</label>
                <input type="text" value={formdata.description} onChange={(e) => setFormdata({...formdata, description : e.target.value})} placeholder='please enter task description' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'  />
            </div>
            <div  className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>deadline</label>
                <input type="date" value={formdata.deadline} onChange={(e) => setFormdata({...formdata, deadline : e.target.value})} placeholder='please set task deadline' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
            </div>
            <div className='flex gap-2'>
                <button type='submit' className='flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition'>create task</button>
                <button type='button' onClick={() => setShowForm(false)} className='flex-1 bg-gray-500 text-white font-medium py-2.5 rounded-lg hover:bg-gray-600 transition'>cancel</button>
            </div>
        </form>
        )}

        {/* edit task  */}
        {editTaskId !== null && 
            <form onSubmit={handleUpdateTask} className='bg-white p-6 rounded-lg shadow mb-6'>
                <h3 className='text-lg font-semibold mb-4'>edit task</h3>
            <div  className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>title</label>
                <input type="text" value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title : e.target.value})} placeholder='enter task title' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
            </div>
            <div  className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>description</label>
                <input type="text" value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description : e.target.value})} placeholder='please enter task description' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
            </div>
            <div  className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>deadline</label>
                <input type="date" value={editFormData.deadline} onChange={(e) => setEditFormData({...editFormData, deadline : e.target.value})} placeholder='please set task deadline' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
            </div>
            <div className='flex gap-2'>
                <button type='submit' className='flex-1 bg-blue-500 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition'>save task</button>
                <button type='button' onClick={() => setEditTaskId(null)} className='flex-1 bg-gray-600 text-white font-medium py-2.5 rounded-lg hover:bg-gray-600 transition'>cancel</button>
            </div>
        </form>
        }

        {/* task card  */}
        <div className='mt-8'>
            <h3 className="text-lg font-semibold mb-4 ">your tasks</h3>
            <div className='grid gap-4'>
                {tasks.map((task) => (
                    <div key={task._id} className='bg-white p-6 rounded-lg shadow hover:shadow-md transition'>
                        <div className='mb-3'>
                            <h2 className="font-semibold text-lg text-gray-800">{task.title}</h2>
                            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                        </div>
                        <div className='mb-4'>
                            <p className="text-gray-500 text-sm">Deadline: <span className='font-medium text-gray-700'>{task.deadline}</span></p>
                            <p className="text-gray-500 text-sm">status: <span className="font-medium text-blue-600">{task.status}</span></p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEditTask(task)} className='flex-1 bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition'>edit</button>
                            <button onClick={() => deleteTask(task._id)} className='flex-1 bg-red-600 text-white font-medium py-2 rounded-lg hover:bg-red-700 transition'>delete task</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
       
    </div>
  )
}

export default Home
