import {useContext } from 'react'
import {AuthContext} from '../context/authContext'
import {Link, useNavigate, } from 'react-router-dom'

function Navbar() {
    const {isLoggedin, user, logout} = useContext(AuthContext)
    const navigate = useNavigate()

    if(!isLoggedin) return null

    const handleLogout =() => {
      logout()
      navigate('/login')
    }


  return (
    <div className=''>
      <nav className='flex justify-between items-center bg-blue-600 text-white p-4 gap-4 hover:un'>
        <div className='flex gap-4'>
          <h2>task-pro</h2>
        </div>
        <div className="flex gap-4 ">
          <Link to='/' className='hover:underline'>dashboard</Link> 
          <Link to='/teams'  className='hover:underline'>teams</Link> 
          <Link to='/notifications' className='hover:underline'>notifications</Link> 
        </div>
        <div className="flex gap-2">
          <span>{user.name}</span>
          <button onClick={handleLogout} className='bg-red-500 text-white rounded-lg'>logout</button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
