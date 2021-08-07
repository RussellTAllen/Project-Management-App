import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthService from '../services/AuthService'
import { AuthContext } from '../context/AuthContext'

function Navbar(props) {
    const { isAuthenticated, setIsAuthenticated, user, setUser} = useContext(AuthContext)

    function onClickLogoutHandler(){
        AuthService.logout().then(data => {
            if(data.success){
                setUser(data.user)
                setIsAuthenticated(false)
            }
        })
    }

    function unauthenticatedNavBar(){
        return (
            <>
                <Link to="/">
                    <li className="nav-item nav-link">
                        Home
                    </li>
                </Link>
                <Link to="/login">
                    <li className="nav-item nav-link">
                        Login
                    </li>
                </Link>
                <Link to="/register">
                    <li className="nav-item nav-link">
                        Register
                    </li>
                </Link>
            </>
        )
    }

    function authenticatedNavBar(){
        return(
            <>
                <h4>User: {user.username}</h4>
                <Link to="/">
                    <li className="nav-item nav-link">
                        Home
                    </li>
                </Link>
                <Link to="/todos">
                    <li className="nav-item nav-link">
                        Todos
                    </li>
                </Link>
                {
                    user.role === 'admin' ?
                    <Link to="/admin">
                        <li className="nav-item nav-link">
                            Admin
                        </li>
                    </Link> : null
                }
                {/* <Link to="/user/logout">
                    <li className="nav-item nav-link">
                        Logout
                    </li>
                </Link> */}
                <button type="button" 
                        className="nav-item nav-link btn btn-link" 
                        onClick={onClickLogoutHandler}>
                    Logout
                </button>
            </>
        )
    }

    console.log(user)

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/">
                <div className="navbar-brand">CatchdiGiorno</div>
            </Link>
            {/* <div className="collapse navbar-collapse" id="navbarText"> */}
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    { !isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar() }
                </ul>
            {/* </div> */}
        </nav>
    )
}

export default Navbar

