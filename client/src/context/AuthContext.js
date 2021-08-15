import React, { createContext, useState, useEffect } from 'react'
import AuthService from '../services/AuthService'

// Create Provider and Consumer
export const AuthContext = createContext()

export default ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        AuthService.isAuthenticated().then(data => {
            setUser(data.user)
            setIsAuthenticated(data.isAuthenticated)
            setIsLoaded(true)
        })
    },[])

    return (
        <div>
            {/* If app is loaded, we are passing the user and isAuthenticated values as a global state */}
            {
            !isLoaded ? <h1>Loading...</h1> : 
            <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
                { children }    
            </AuthContext.Provider>
            }
        </div>
    )
}