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


function App() {
  const {isLoggedin} = useContext(AuthContext)

  return (
    <>
    <ToastContainer/>
      <Navbar />
      <Routes>
        <Route path='/' element={isLoggedin ? <Home/> : <Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/teams' element={<Teams/>} />
        <Route path='/notifications' element={<Notification/>} />
        <Route path='/profile' element={<Profile/>} />

      </Routes>
    </>
  )
}

export default App
