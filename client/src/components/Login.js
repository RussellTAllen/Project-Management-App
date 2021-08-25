import React, { useState, useContext } from 'react'
import AuthService from '../services/AuthService'
import Message from '../components/Message'
import { AuthContext } from '../context/AuthContext'

function Login(props) {
    const [user, setUser] = useState({ username: '', password: '' })
    const [message, setMessage] = useState(null)
    const authContext = useContext(AuthContext)

    function onChange(e){
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    function onSubmit(e){
        e.preventDefault()
        AuthService.login(user).then(data => {
            const { isAuthenticated, user, message } = data
            if(isAuthenticated){
                authContext.setUser(user)
                authContext.setIsAuthenticated(isAuthenticated)
                props.history.push('/todos')
            }else{
                setMessage(message)
            }
        })
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <h3>Please sign in</h3>
                {message ? <Message message={message} /> : null}
                <label htmlFor="username" className="sr-only">Username: </label>
                <input type="text" 
                        name="username" 
                        onChange={onChange} 
                        className="form-control" 
                        placeholder="Enter username" 
                />
                <input type="password" 
                        name="password" 
                        onChange={onChange} 
                        className="form-control" 
                        placeholder="Enter password" 
                />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login
