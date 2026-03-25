import {Routes, Route} from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import { AuthContext } from './context/authContext'
import { useContext } from 'react'
import Navbar from './components/Navbar'
import Teams from './pages/Teams'
import Notification from './pages/Notification'
import { ToastContainer } from "react-toastify";
import Profile from './pages/Profile'
import { Navigate } from 'react-router-dom'


function App() {
  const {isLoggedin} = useContext(AuthContext)

  return (
    <>
    <ToastContainer/>

      {isLoggedin && <Navbar />}

      <Routes>
        <Route path='/' element={isLoggedin ? <Home/> : <Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />

        <Route path='/teams' element={isLoggedin ? <Teams/> : <Navigate to='/login' />} />
        <Route path='/notifications' element={isLoggedin ? <Notification/> : <Navigate to='/login' />} />
        <Route path='/profile' element={isLoggedin ? <Profile/> : <Navigate to='/login' />} />
      </Routes>
    </>
  )
}

export default App
