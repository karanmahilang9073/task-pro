import axios from 'axios'

const apiInstance = axios.create({
    baseURL : "http://localhost:8000/api",
    headers : {
        "Content-Type" : "application/json"
    }
})

//request interceptor
apiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token){
        config.headers = {...config.headers, Authorization : `Bearer ${token}`}
    }
    return config
}, 
(error) => Promise.reject(error)
)

//wrapper object
const api = {
    get : (url, config) => apiInstance.get(url, config),
    post : (url, data, config) => apiInstance.post(url, data, config),
    put : (url, data, config) => apiInstance.put(url, data, config),
    delete : (url, config) => apiInstance.delete(url, config)
}

export const authApi = {
    register : (name, email, password) => api.post('/auth/register', {name, email, password}),
    login : (email, password) => api.post('/auth/login', {email, password}),
    getAllUsers : () => api.get('/auth/all')
}

export const taskApi = {
    createTask : (title, description, deadline, assignedTo) => api.post('/tasks/create-task', {title, description, deadline, assignedTo}),
    getTask : (taskId) => api.get(`/tasks/${taskId}`),
    getAllTasks : () => api.get(`/tasks`),
    updateTask : (title, description, deadline, assignedTo, taskId) => api.put(`/tasks/${taskId}`, {title, description, deadline, assignedTo}),
    deleteTask : (taskId) => api.delete(`/tasks/${taskId}`)
}

export const teamApi = {
    createTeam : (name, description) => api.post('/teams', {name, description}),
    getAllTeams : () => api.get('/teams'),
    getTeam : (teamId) => api.get( `/teams/${teamId}`),
    updateTeam : (teamId, name, description) => api.put(`/teams/${teamId}`, {name, description}),
    deleteTeam : (teamId) => api.delete(`/teams/${teamId}`),
    addMembers : (teamId, memberId) => api.post(`/teams/${teamId}/add-member`, {memberId}),
    removeMember : (teamId, memberId) => api.post(`/teams/${teamId}/delete-member`, {memberId})
}

export const notificationApi = {
    getAllNotification : () => api.get('/notification'),
    getNotification : (notificationId) => api.get(`/notification/${notificationId}`),
    deleteNotification : (notificationId) => api.delete(`/notification/${notificationId}`)
}


export default api