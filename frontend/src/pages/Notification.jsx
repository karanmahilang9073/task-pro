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
    <div className="bg-gray-100 p-6 ">
            {loading && <p className='bg-blue-50 border  border-blue-200 text-blue-600 text-sm rounded-lg px-3 py-2 mb-4'>fetching notifications, please wait...</p>}

            {/* error */}
            {error && <p className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4'>{error}</p>}

            {!loading && notification.length === 0 &&  (
                <div className="text-gray-500">no notifications available</div>
            )}

            {/* notidication card  */}
            {!loading && notification.length > 0 && (
                notification.map((notif) => (
                    <div key={notif._id} className="p-4 bg-white rounded-lg shadow mb-4 ">
                        <p className="">{notif.message}</p>
                        <p>type: {notif.type}</p>
                        <button  className="px-3 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-700 transition" onClick={() => handleDelete(notif._id)}>delete</button>
                    </div>
                ))
            )}
    </div>
  )
}

export default Notification
