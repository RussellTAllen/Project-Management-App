import React, { useState, useContext, useEffect } from 'react'
import TodoItem from './TodoItem'
import CreateProject from './CreateProject'
import TodoService from '../services/TodoService'
import ProjectService from '../services/ProjectService'
import { AuthContext } from '../context/AuthContext'
import CreateTodo from './CreateTodo'
import SortProject from './SortProject'
import Message from './Message'

const priorities = {
    "Low": 1,
    "Medium": 2,
    "High": 3,
    "URGENT": 4
}


function Todos(props) {
    const [todo, setTodo] = useState({ item: '' })
    const [todos, setTodos] = useState([])
    // const [selectedProject, setSelectedProject] = useState({})
    const [createProject, setCreateProject] = useState({ name: '' })
    const [project, setProject] = useState('all-projects')
    const [priority, setPriority] = useState('Low')
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
        })
    },[])

    function handleSortProjectChange(project, projectName){
        console.log(project)
        setProject(project)
        setProjectName(projectName)
        ProjectService.getTodosByProject(project).then(data => {
            console.log(data)
            setTodos(data.todos)
        })
    }

    function handleTodoChange(todo){
        console.log(todo)
        setTodo(todo)
    }

    function handleProjectCreateChange(createProject){
        console.log(createProject)
        setCreateProject(createProject)
    }

    function handlePriorityChange(priority){
        console.log(priority)
        setPriority(priority)
    }

    function handleTodoSubmit(todo, project, priority){
        TodoService.createTodo(todo, project, priority).then(data => {
            const { message } = data
            if(!message.msgError){
                ProjectService.getTodosByProject(project).then(data =>{
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
                ProjectService.getProjects().then(data => {
                    console.log(data)
                    setProjects(data.projects)
                })
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
        setCreateProject({ 'name': ''})
    }


    function refreshTodoState(){
        ProjectService.getTodosByProject(project._id).then(data => {
            setTodos(data.todos)
        })
    }

    todos?.sort((a,b) => priorities[b.priority] - priorities[a.priority])

    console.log(projectName)
   
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
                            priority={priority}
                            onTodoChange={handleTodoChange} 
                            onTodoSubmit={handleTodoSubmit} 
                            onPriorityChange={handlePriorityChange} 
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
            <table>
                <thead>
                    <tr>
                        <td>Todo Item</td>
                        <td>Priority</td>
                        <td>Date Created</td>
                        {
                            projectName === 'All Projects' ? 
                                <td>Project</td> 
                                : null
                        }
                        <td>Remove Item</td>
                    </tr>
                </thead>
                <tbody>
                {   
                    todos?.map(todo => {
                        return <TodoItem key={todo._id} todo={todo} project={project} onRemove={refreshTodoState} />
                    })
                }
                </tbody>
            </table>
       </div>
    )
}

export default Todos