import { useContext, useEffect, useState } from "react"
import { notificationApi } from "../api/api"
import { AuthContext } from "../context/authContext"

function Notification() {
    const [notification, setNotification] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError]  = useState(null)

    const {isLoggedin} = useContext(AuthContext);

    const fetchNotifications = async() => {
        try {
            setLoading(true)
            const res = await notificationApi.getAllNotification()
            setNotification(res.data.notifications)
        } catch (error) {
            setError(error.response?.data?.message || 'failed to get fetch notifications')
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(isLoggedin){
            fetchNotifications()
        }
    }, [isLoggedin])

    const handleDelete = async(notificationId) => {
        try {
            setLoading(true)
            await notificationApi.deleteNotification(notificationId)
            fetchNotifications()
        } catch (error) {
            setError(error.response?.data?.message || 'failed to delete notification')
        }
    }


  return (
    <div>
      
    </div>
  )
}

export default Notification
