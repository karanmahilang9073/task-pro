import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/authContext'
import { authApi } from '../api/api'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import {useNavigate} from 'react-router-dom'

function Profile() {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [formdata, setFormdata] = useState({
        name : '',
        email : '',
        password : '',
    })

    const navigate = useNavigate()

    const {user, updateUser, logout} = useContext(AuthContext)

    useEffect(() => {
        if(user){
            setFormdata({name : user.name || '', email : user.email || '', password : ''})
        }
    }, [user])

    const handleEdit = () => {
        setIsEditing(true)

    }

    const handleCancel = () => {
        setIsEditing(false)
        setFormdata({name : user.name || '', email : user.email || '', password : ''})
    }

    const handleSave = async() => {
        setLoading(true)
        setError(null)
        try {
            await authApi.updateUser(formdata.name, formdata.email, formdata.password)
            updateUser({name : formdata.name, email : formdata.email, role : user.role})
            setIsEditing(false)
            setFormdata({name :user.name || '', email :user.email || '', password : ''})
            toast.success('user updated successfully')
        } catch (error) {
            setError(error.response?.data?.message || 'failed to update user')
            toast.error('failed to update user')
        } finally {
            setLoading(false)
        }
    }

    if(!user) {
       return <div>Loading...</div>
    }

    const handleDelete = async() => {
        const confirmDelete = window.confirm("are u sure want to delete your account? this action cannnot be undone")
        if(!confirmDelete) return true
        
        try {
            setLoading(true)
            setError(null)
            await authApi.deleteUser()
            toast.success('user deleted successfully')
            logout()
            navigate('/register')
        } catch (error) {
            setError(error.response?.data?.message || "failed to delete account")
            toast.error('failed to delete user')
        } finally {
            setLoading(false)
        }
    }

  return (
    <div>
        
        {/* user details  */}
        {!isEditing && (
            <div className='max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-10'>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-6 ">My Profile</h2>
      
                <div className="space-y-4">

                    {/* name */}
                    <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className='text-lg font-medium text-gray-800'>{user.name}</p>
                    </div>

                    {/* email */}
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className='text-lg font-medium text-gray-800'>{user.email}</p>
                    </div>

                    {/* role */}
                    <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className='text-lg font-medium text-gray-800 capitalize'>{user.role}</p>
                    </div>
                </div>

                {/* buttons */}
                <div className="flex gap-2">
                    <button onClick={handleEdit} className='mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'>edit profile</button>
                    <button onClick={handleDelete} className='bg-red-500 text-white rounded-lg mt-6 px-4 py-2 hover:bg-red-700 transition' disabled={loading}>delete account</button>
                </div>
            </div>
        )}

        {/* editing mode  */}
        {isEditing && (
            <div className='max-w-md bg-white hover:shadow-md rounded-lg p-6 space-y-4 justify-center'>

                <h2 className='text-2xl font-bold text-gray-700 text-center'>edit your profile</h2>

                {error && <p className='w-full bg-red-50 text-red-500 rounded-md border border-red-500 text-sm'>{error}</p>}

                {/* edit name */}
                <div className='flex flex-col'>
                    <label className='text-sm font-medium text-gray-600 mb-1' >name</label>
                    <input type="text" value={formdata.name} onChange={(e) => setFormdata({...formdata, name : e.target.value})} placeholder='enter new name' className='border border-gray-300 rounded-md px-3 py-2 focus:otutline-none focus:ring-2 focus:ring-blue-400' />
                </div>

                {/* edit email */}
                <div className='flex flex-col'>
                    <label className='text-sm font-medium text-gray-600 mb-1' >email</label>
                    <input type="email" value={formdata.email} onChange={(e) => setFormdata({...formdata, email : e.target.value})} placeholder='enter new email' className='border border-gray-300 rounded-md px-3 py-2 focus:otutline-none focus:ring-2 focus:ring-blue-400' />
                </div>

                {/* edit password */}
                <div className='flex flex-col'>
                    <label className='text-sm font-medium text-gray-600 mb-1' >password</label>
                    <input type="password" value={formdata.password} onChange={(e) => setFormdata({...formdata, password : e.target.value})} placeholder='enter new password' className='border border-gray-300 rounded-md px-3 py-2 focus:otutline-none focus:ring-2 focus:ring-blue-400' />
                </div>

                {/* save button */}
                <div className='flex gap-3 pt-2'>
                    <button onClick={handleSave} disabled={loading} className='flex-1 bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-md transition'>{loading ? 'saving' : 'save'}</button>
                    <button onClick={handleCancel} disabled={loading} className='flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-md transition'>cancel</button>
                </div>
            </div>
        )}
    </div>
  )
}

export default Profile
