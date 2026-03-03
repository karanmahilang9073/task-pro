import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import { AuthContext } from './context/authContext'
import { useContext } from 'react'


function App() {
  const {isLoggedin} = useContext(AuthContext)

  return (
    <>
      <Routes>
        <Route path='/' element={isLoggedin ? <Home/> : <Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
      </Routes>
    </>
  )
}

export default App
