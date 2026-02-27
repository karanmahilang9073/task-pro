import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Register() {
    const [formdata, setFormdata] = useState({
        name : "",
        email : "",
        password : ""
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await axios.post('http://localhost:8000/api/auth/register', formdata)
            navigate('/login')
        } catch (error) {
            setError(error.response?.data?.message || "registration failed")
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4 '>
        <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6'>

            {/* title  */}
            <div className='text-center'>
                <h2 className='text-2xl font-bold text-gray-800'>create account</h2>
                <p className='text-sm text-gray-500'>sig up to get started</p>
            </div>

            {/* if something error  */}
            {error && <div className=' bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2'>something went wrong, please try again</div> }

            <div >
                <label className='block text-sm font-medium text-gray-700 mb-1'>name</label>
                <input onChange={(e) => setFormdata({...formdata, name : e.target.value})} type="text" className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition' placeholder='enter your name' />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>email</label>
                <input onChange={(e) => setFormdata({...formdata, email : e.target.value})} type="text" className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition' placeholder='enter your email' />
            </div>
            <div className='flex flex-col'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>password</label>
                <input onChange={(e) => setFormdata({...formdata, password : e.target.value})} type="password" className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition' placeholder='enter your password' />
            </div>
            <button  onClick={handleSubmit} className='w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center  gap-2' disabled={loading}>
                {loading ? 'registering' : 'register'}
            </button>

            {/* footer  */}
            <p className='text-sm text-center text-gray-500'>already have an account?   
                <Link to='/login' className='text-blue-500 hover:underline font-medium'>login</Link>
            </p>
        </div>

        
    </div>
  )
}

export default Register
