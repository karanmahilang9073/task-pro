import { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext.jsx'
import { authApi, taskApi } from '../api/api'
import {toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

function Home() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [users, setUsers] = useState([])

    //task states
    const [formdata, setFormdata] = useState({
        title : '',
        description : '',
        deadline : '',
        assignedTo : '',
    })
    
    //edit task states
    const [editTaskId, setEditTaskId] = useState(null)
    const [editFormData, setEditFormData] = useState({
        title : '',
        description : '',
        deadline : '',
        assignedTo : '',
    })

    const [selectedStatus, setSelectedStatus] = useState('all')

    const {isLoggedin} = useContext(AuthContext)

    useEffect(() => {
        const fetchUsers = async() => {
            try {
                setLoading(true)
                const res = await authApi.getAllUsers()
                setUsers(res.data.users)
            } catch (error) {
                setError(error.response?.data?.message || 'failed to fetch users')
                toast.error('failed to fetch users')
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])


    const fetchTask = useCallback(async() => {
        try {
            setLoading(true)
            const res = await taskApi.getAllTasks()
            setTasks(res.data.tasks)
        } catch (error) {
            setError(error.response?.data?.message || 'failed to fetch tasks')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if(isLoggedin){
            fetchTask()
        }
    }, [isLoggedin, fetchTask])

    // create task
    const handleTask = async(e) => {
        e.preventDefault()
        try {
            await taskApi.createTask(formdata.title, formdata.description, formdata.deadline, formdata.assignedTo)
            setFormdata({title : '', description : '', deadline : '', assignedTo : ''})
            setError(null)
            await fetchTask()
            toast.success('task created successfully')
        } catch (error) {
            setError(error.response?.data?.message || 'failed to create task')
            toast.error('failed to create task')
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
            toast.success('task deleted successfully')
        } catch (error) {
            setError(error.response?.data?.message || 'failed to delete task')
            toast.error('failed to delete task')
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

    const formatDate = (dateString) => {
        if(!dateString) return 'no deadline'
        return new Date(dateString).toLocaleDateString('en-us', {year : 'numeric', month : 'short', day : 'numeric'})
    }

    //update task
    const handleUpdateTask = async(e) => {
        try {
            e.preventDefault()
            await taskApi.updateTask(editFormData.title, editFormData.description, editFormData.deadline,editFormData.assignedTo, editTaskId)
            setEditFormData({title : '', description : '', deadline : '', assignedTo : ''})
            await fetchTask()
            setEditTaskId(null)
            toast.success('task updated successfully')
        } catch (error) {
            setError(error.response?.data?.message || 'failed to updated task')
            toast.error('failed to update task')
        }
    }

    //filter tasks
    const filteredTask = selectedStatus === "all" ? tasks : tasks.filter((task) => task.status === selectedStatus)

  return (
    <div className='min-h-screen bg-gray-300 p-6'>

        {/* loading  */}
        {loading && tasks.length === 0 && <p className='bg-blue-50 border  border-blue-200 text-blue-600 text-sm rounded-lg px-3 py-2 mb-4'>loading</p>}

        {/* error */}
        {error && <p className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4'>{error}</p>}

        {/* task list  */}
        {!loading && tasks.length === 0 && (
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

            {/* title  */}
            <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>title</label>
                <input type="text" value={formdata.title} onChange={(e) => setFormdata({...formdata, title : e.target.value})} placeholder='enter task title' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
            </div>

            {/* description  */}
            <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>description</label>
                <input type="text" value={formdata.description} onChange={(e) => setFormdata({...formdata, description : e.target.value})} placeholder='please enter task description' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'  />
            </div>

            {/* deadline  */}
            <div  className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>deadline</label>
                <input type="date" value={formdata.deadline} onChange={(e) => setFormdata({...formdata, deadline : e.target.value})} placeholder='please set task deadline' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
            </div>

            {/* assigned to  */}
            <div className="mb-4">
                <label className='block text-sm font-medium text-gray-700 mb-1'>Assign To</label>
                <select value={formdata.assignedTo} onChange={(e) => setFormdata({...formdata, assignedTo : e.target.value})} className='w-full rounded-lg border border-gray-300 px-4 py-2'>
                    <option value="">Select user</option>
                    {users.map((user) => (
                        <option value={user._id} key={user._id} >
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* buttons  */}
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

                {/* edit title */}
                <div  className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>title</label>
                    <input type="text" value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title : e.target.value})} placeholder='enter task title' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>

                {/* edit descrption  */}
                <div  className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>description</label>
                    <input type="text" value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description : e.target.value})} placeholder='please enter task description' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>

                {/* edit deadline */}
                <div  className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>deadline</label>
                    <input type="date" value={editFormData.deadline} onChange={(e) => setEditFormData({...editFormData, deadline : e.target.value})} placeholder='please set task deadline' className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>

            {/* edit assigned to*/}
            <div className="mb-4">
                <label className='block text-sm font-medium text-gray-700 mb-1'>Assign To</label>
                <select value={editFormData.assignedTo} onChange={(e) => setEditFormData({...editFormData, assignedTo : e.target.value})} className='w-full rounded-lg border border-gray-300 px-4 py-2'>
                    <option value="">Select user</option>
                    {users.map((user) => (
                        <option value={user._id} key={user._id} >
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* save edited task button  */}
            <div className='flex gap-2'>
                <button type='submit' className='flex-1 bg-blue-500 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition'>save task</button>
                <button type='button' onClick={() => setEditTaskId(null)} className='flex-1 bg-gray-600 text-white font-medium py-2.5 rounded-lg hover:bg-gray-600 transition'>cancel</button>
            </div>
        </form>
        }

        {/* status section button  */}
        <div className="flex gap-2 flex-wrap mb-6">
            <button className='bg-gray-400 text-white rounded px-3 py-2' onClick={()=> setSelectedStatus('all')}>all</button>
            <button className='bg-yellow-400 text-white rounded px-3 py-2' onClick={()=> setSelectedStatus('pending')}>pending</button>
            <button className='bg-orange-400 text-white rounded px-3 py-2' onClick={()=> setSelectedStatus('inprogress')}>in Progress</button>
            <button className='bg-green-400 text-white rounded px-3 py-2' onClick={()=> setSelectedStatus('completed')}>completed</button>
            <button className='bg-red-600 text-white rounded px-3 py-2' onClick={()=> setSelectedStatus('deadlineMissed')}>deadline-Missed</button>
        </div>


        {/* task card  */}
        <div className='mt-8'>
            <h3 className="text-lg font-semibold mb-4 ">your tasks</h3>
            <div className='grid gap-4'>
                {filteredTask.map((task) => (
                    <div key={task._id} className='bg-white p-6 rounded-lg shadow hover:shadow-md transition'>

                        <div className='mb-3'>
                            <h2 className="font-semibold text-lg text-gray-800">{task.title}</h2>
                            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                        </div>

                        <div className='mb-4'>
                            <p className="text-gray-500 text-sm">Deadline: <span className='font-medium text-gray-700'>{formatDate(task.deadline)}</span></p>
                            <p className="text-gray-500 text-sm">status: <span className={`font-medium ${task.status == 'completed' ? 'text-green-600' : task.status == 'deadlineMissed' ? 'text-red-600' : task.status == 'inprogress' ? 'text-yellow-600' : 'text-blue-600'}`}>{task.status}</span></p>
                            <p className="text-gray-500 text-sm">Assigned to: <span className='font-medium text-blue-600'>{task.assignedTo?.name || 'not assigned to anyone'}</span></p>
                        </div>

                        {/* edit button  */}
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
