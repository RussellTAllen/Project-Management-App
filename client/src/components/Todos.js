import React, { useState, useContext, useEffect } from 'react'
import TodoItem from './TodoItem'
import CreateProject from './CreateProject'
import TodoService from '../services/TodoService'
import ProjectService from '../services/ProjectService'
import { AuthContext } from '../context/AuthContext'
import CreateTodo from './CreateTodo'
import SortProject from './SortProject'
import Message from './Message'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'

const priorities = {
    "Low": 1,
    "Medium": 2,
    "High": 3,
    "URGENT": 4
}

function Todos(props) {
    const [clicked, setClicked] = useState(false)
    const [todo, setTodo] = useState({ item: '' })
    const [todos, setTodos] = useState([])
    // const [selectedProject, setSelectedProject] = useState({})
    const [createProject, setCreateProject] = useState({ name: '' })
    const [project, setProject] = useState('all-projects')
    const [priority, setPriority] = useState('Low')
    const [projectName, setProjectName] = useState('All Projects')
    const [projects, setProjects] = useState([])
    const [ascending, setAscending] = useState(false)
    const [message, setMessage] = useState(null)
    const authContext = useContext(AuthContext)

    useEffect(() => {
        TodoService.getTodos().then(data => {
            setTodos(data.todos.filter(todo => !clicked ? !todo.completed : todo.completed))
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
            setTodos(data.todos.filter(todo => !clicked ? !todo.completed : todo.completed))
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
                    setTodos(data.todos.filter(todo => !clicked ? !todo.completed : todo.completed))
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
        ProjectService.getTodosByProject(project).then(data => {
            setTodos(data.todos.filter(todo => !clicked ? !todo.completed : todo.completed))
        })
    }

    function sortByPriority(){
        ProjectService.getTodosByProject(project).then(data => {
            setTodos(data.todos.filter(todo => !clicked ? !todo.completed : todo.completed).sort((a,b) => priorities[b.priority] - priorities[a.priority]))
        })
    }
    
    function sortByRecentDate(){
            ProjectService.getTodosByProject(project).then(data => {
                setTodos(data.todos.filter(todo => !clicked ? !todo.completed : todo.completed).sort((a,b) => a.created > b.created ? -1 : 1))
            })
    }

    function sortByOldestDate(){
            ProjectService.getTodosByProject(project).then(data => {
                setTodos(data.todos.filter(todo => !clicked ? !todo.completed : todo.completed).sort((a,b) => a.created > b.created ? 1 : -1))
            })
    }

    function toggleComplete(todo){
        console.log(todo)
    }

    function seeCompletedTodos(e){
        setClicked(!clicked)
        TodoService.getTodos().then(data => {
            setTodos(data.todos.filter(todo => !clicked ? !todo.completed : todo.completed))
        })
        e.target.textContent = 'View Active Todos'
    }

    function seeActiveTodos(e){
        setClicked(!clicked)
        TodoService.getTodos().then(data => {
            setTodos(data.todos.filter(todo => !clicked ? !todo.completed : todo.completed))
        })
        e.target.textContent = 'View Completed Todos'
    }

    return (
        <div>
            <CreateProject 
                createProject={createProject} 
                onProjectCreateChange={handleProjectCreateChange} 
                onProjectCreateSubmit={handleProjectCreateSubmit}
            />
            <hr />
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

            <hr />

            <h3>Active Todos for <em>{projectName}</em></h3>
            <button onClick={!clicked ? seeCompletedTodos : seeActiveTodos}>View Completed Todos</button>
            <table>
                <thead>
                    <tr>
                        <td>Done</td>
                        <td>Todo Item</td>
                        <td onClick={sortByPriority}>Priority</td>
                        <td className="date">
                            <FaArrowUp onClick={sortByRecentDate} /> 
                            <span>  Date Created  </span>
                            <FaArrowDown onClick={sortByOldestDate} />
                        </td>
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
                        return <TodoItem 
                                        key={todo._id} 
                                        todo={todo} 
                                        project={project} 
                                        onRemove={refreshTodoState}
                                        />
                    })
                }
                </tbody>
            </table>
       </div>
    )
}

export default Todos