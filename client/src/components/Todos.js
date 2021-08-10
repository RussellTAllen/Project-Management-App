import React, { useState, useContext, useEffect } from 'react'
import TodoItem from './TodoItem'
import CreateProject from './CreateProject'
import TodoService from '../services/TodoService'
import ProjectService from '../services/ProjectService'
import { AuthContext } from '../context/AuthContext'
import CreateTodo from './CreateTodo'
import Message from './Message'

// let user = user


function Todos(props) {
    // const [todo, setTodo] = useState({ item: '' })
    const [todos, setTodos] = useState([])
    const [projects, setProjects] = useState([])
    const [message, setMessage] = useState(null)
    const authContext = useContext(AuthContext)


    useEffect(() => {
        TodoService.getTodos().then(data => {
            setTodos(data.todos)
        })
    },[todos])

    useEffect(() => {
        ProjectService.getProjects().then(data => {
            setProjects(data.projects)
        })
    },[projects])


    return (
        <div>
            <CreateProject />
            <h4>Sort by project: </h4>
            <select>
                {
                    projects.map(p => {
                        return <option value={p.name} key={p._id}>{p.name}</option>
                    })
                }
            </select>
            <p>
                {
                    projects.map(p =>{
                        return <span key={p._id}>{p.name}</span>
                    })
                }
            </p>
            <ul className="list-group">
                {   
                    todos?.map(todo => {
                        return <TodoItem key={todo._id} todo={todo} />
                    })
                }
            </ul>
            <br />
            <CreateTodo />

       </div>
    )
}

export default Todos