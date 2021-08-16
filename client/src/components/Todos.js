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


function Todos(props) {
    const [todo, setTodo] = useState({ item: '' })
    const [todos, setTodos] = useState([])
    // const [selectedProject, setSelectedProject] = useState({})
    const [createProject, setCreateProject] = useState('')
    const [project, setProject] = useState('all-projects')
    const [projectName, setProjectName] = useState('All Projects')
    const [projects, setProjects] = useState([])
    const [message, setMessage] = useState(null)
    const authContext = useContext(AuthContext)

    useEffect(() => {
        TodoService.getTodos().then(data => {
            setTodos(data.todos)
        })
    },[])

    useEffect(() => {
        ProjectService.getProjects().then(data => {
            setProjects(data.projects)
            // setProject(data.projects[0])
        })
    },[projects])

    function handleSortProjectChange(project, projectName){
        console.log(project)
        setProject(project)
        setProjectName(projectName)
        ProjectService.getTodosByProject(project).then(data => {
            setTodos(data.todos)
        })
    }

    function handleTodoChange(todo){
        console.log(todo)
        setTodo(todo)
    }

    function handleProjectCreateChange(createProject){
        console.log(project)
        console.log(createProject)
        setCreateProject(createProject)
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

    function handleProjectCreateSubmit(createProject){
        console.log('project: '+createProject)
        ProjectService.createProject(createProject).then(data => {
            const { message } = data
            console.log('data from handleProject submission: ')
            console.log(data)
            
            if(!message.msgError){
                console.log('Created new project!')
                resetProjectForm()
            }else{
                setMessage(message)
            }
        })
    }

    function resetTodoForm(){
        setTodo({ item: '' })
    }

    function resetProjectForm(){
        setCreateProject('')
    }
   
    return (
        <div>
            <CreateProject 
                createProject={createProject} 
                onProjectCreateChange={handleProjectCreateChange} 
                onProjectCreateSubmit={handleProjectCreateSubmit} 
            />
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

            <div>
                {
                    projects.map(p =>{
                        return <p key={p._id}>Project: {p.name}</p>
                    })
                }
            </div>

            <h3>Todos for <em>{projectName}</em></h3>
            <ul className="list-group">
                {   
                    todos?.map(todo => {
                        return <TodoItem key={todo._id} todo={todo} />
                    })
                }
            </ul>

       </div>
    )
}

export default Todos