import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/authContext'
import { authApi } from '../api/api'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

function Profile() {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [formdata, setFormdata] = useState({
        name : '',
        email : '',
        password : '',
    })

    const {user} = useContext(AuthContext)

    useEffect(() => {
        if(user){
            setFormdata({name : user.name || '', email : user.email || '', password : ''})
        }
    }, [user])

    const handleEdit = async() => {
        isEditing(true)
    }

    const handlecancel = async() => {
        
    }


    
  return (
    <div>
      
    </div>
  )
}

export default Profile
