import {createContext, useEffect, useState} from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [isLoggedin, setIsLoggedin] = useState(false)

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        if(storedToken){
            setToken(storedToken)
            setUser(storedUser ? JSON.parse(storedUser) : null)
            setIsLoggedin(true)
        }
    }, [])

     const register = (userData, userToken) => {
        setUser(userData)
        setToken(userToken)
        setIsLoggedin(true)
        localStorage.setItem('token', userToken)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const login = (userData, userToken) => {
        setUser(userData)
        setToken(userToken)
        setIsLoggedin(true)
        localStorage.setItem('token', userToken)
        localStorage.setItem('user', JSON.stringify(userData))

    }
    
    const logout = () => {
        setUser(null)
        setToken(null)
        setIsLoggedin(false)

        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider 
        value={{
            token,
            user, 
            register,
            isLoggedin,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}
