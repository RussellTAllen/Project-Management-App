import React, { useState, useContext, useEffect } from 'react'
import TodoItem from './TodoItem'
import TodoService from '../services/TodoService'
import ProjectService from '../services/ProjectService'
import { AuthContext } from '../context/AuthContext'
import Message from './Message'

// let user = user


function Todos(props) {
    const [todo, setTodo] = useState({ item: '' })
    const [todos, setTodos] = useState([])
    const [project, setProject] = useState({ name: '' })
    const [projects, setProjects] = useState([])
    const [message, setMessage] = useState(null)
    const authContext = useContext(AuthContext)
    const {user} = useContext(AuthContext)

    // console.log(user)


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

    function onSubmit(e){
        e.preventDefault()
        TodoService.createTodo(todo).then(data => {
            const { message } = data
            resetForm()
            if(!message.msgError){
                TodoService.getTodos().then(data =>{
                    setTodos(data.todos)
                    setMessage(message)
                })
            }else if(message.msgBody === 'Unauthorized'){
                setMessage(message)
                authContext.setUser({ username: '', role: '' })
                authContext.setIsAuthenticated(false)
            }else{
                setMessage(message)
            }
        })
    }

    function onChange(e){
        setTodo({ item: e.target.value })
    }

    function handleNewProjectSubmit(e){
        e.preventDefault()
        ProjectService.createProject(project).then(data => {
            const { message } = data
            
            if(!message.msgError){
                console.log('success!')
            }else{
                setMessage(message)
            }
        })
        
    }
    function onChangeProject(e){
        setProject({ name: e.target.value })
    }

    function resetForm(){
        setTodo({ item: '' })
    }

    return (
        <div>
            <form onSubmit={handleNewProjectSubmit}>
                <label htmlFor="project">Create a new project</label>
                <input type="text"
                        name="project"
                        value={project.name}
                        onChange={onChangeProject}
                        className="form-control"
                        placeholder="Enter new project name"
                    />
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Create new project</button>
            </form>
            <h4>Sort by project: </h4>
            <select>
                {
                    
                }
            </select>
            <p>
                {
                    projects.map(p =>{
                        return <span>{p.name}</span>
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
            <form onSubmit={onSubmit}>
                <label htmlFor="todo">Enter Todo</label>
                <input type="text" 
                        name="todo" 
                        value={todo.item} 
                        onChange={onChange}
                        className="form-control"
                        placeholder="Enter Todo"
                />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Submit</button>
            </form>
                { message ? <Message message={message} /> : null }
       </div>
    )
}

export default Todos