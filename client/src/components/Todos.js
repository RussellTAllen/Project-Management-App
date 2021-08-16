import React, { useState, useContext, useEffect } from 'react'
import TodoItem from './TodoItem'
import CreateProject from './CreateProject'
import TodoService from '../services/TodoService'
import ProjectService from '../services/ProjectService'
import { AuthContext } from '../context/AuthContext'
import CreateTodo from './CreateTodo'
import SortProject from './SortProject'
import Message from './Message'

// let user = user
export const MessageContext = React.createContext({ message: null, setMessage: () => {} });

const useProjects = () => {
    const [projects, setProjects] = useState([])

    useEffect(() => {
        ProjectService.getProjects().then(data => {
            setProjects(data.projects)
            // setProject(data.projects[0])
        })
    }, [])

    return projects
}

function Todos(props) {
    const [todo, setTodo] = useState({ item: '' })
    const [todos, setTodos] = useState([])
    const [project, setProject] = useState('all-projects')
    const [projectName, setProjectName] = useState('All Projects')
    const [message, setMessage] = useState(null)
    const projects = useProjects()
    const authContext = useContext(AuthContext)

    useEffect(() => {
        TodoService.getTodos().then(data => {
            setTodos(data.todos)
        })
    },[])

    function handleSortProjectChange(project, projectName){
        console.log(project)
        setProject(project)
        setProjectName(projectName)
        // refreshTodoState()
        ProjectService.getTodosByProject(project).then(data => {
            setTodos(data.todos)
        })
    }

    function handleTodoChange(todo){
        console.log(todo)
        setTodo(todo)
    }

    function handleTodoSubmit(todo, project){
        console.log(todo)
        console.log(project)
        TodoService.createTodo(todo, project).then(data => {
            const { message } = data
            if(!message.msgError){
                ProjectService.getTodosByProject(project).then(data =>{
                    console.log(data)
                    setTodos(data.todos)
                    setMessage(message)
                    resetTodoForm()
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

    function resetTodoForm(){
        setTodo({ item: '' })
    }

    function refreshTodoState(){
        ProjectService.getTodosByProject(project).then(data => {
            setTodos(data.todos)
        })
    }
   
    return (
        <MessageContext.Provider value={{ message, setMessage }}>
        <div>
            <CreateProject />
            <SortProject projects={projects} onProjectSort={handleSortProjectChange} />
            {
                projects.length > 0 ?
                    <CreateTodo 
                            todo={todo} 
                            project={project}
                            onTodoChange={handleTodoChange} 
                            onTodoSubmit={handleTodoSubmit} 
                    />
                    : <h3>To Create A Todo, First Create A Project</h3>
            }

            <div style={{'background': 'cyan'}}>
                {
                    projects?.map(p =>{
                        return <p key={p._id}>Project: {p.name}</p>
                    })
                }
            </div>

            <h3>Todos for <em>{projectName}</em></h3>
            <ul className="list-group">
                {   
                    todos?.map(todo => {
                        return <TodoItem key={todo._id} todo={todo} onRemove={refreshTodoState} />
                    })
                }
            </ul>
        </div>
        </MessageContext.Provider>
    )
}

export default Todos