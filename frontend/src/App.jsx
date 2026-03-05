import {Routes, Route} from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import { AuthContext } from './context/authContext'
import { useContext } from 'react'
import Navbar from './components/Navbar'
import Teams from './pages/Teams'


function App() {
  const {isLoggedin} = useContext(AuthContext)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={isLoggedin ? <Home/> : <Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/teams' element={<Teams/>} />
      </Routes>
    </>
  )
}

export default App
