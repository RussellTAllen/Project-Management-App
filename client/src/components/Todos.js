import React, { useState, useContext, useEffect } from 'react'
import TodoItem from './TodoItem'
import CreateProject from './CreateProject'
import TodoService from '../services/TodoService'
import ProjectService from '../services/ProjectService'
import { AuthContext } from '../context/AuthContext'
import CreateTodo from './CreateTodo'
import SortProject from './SortProject'
import Message from './Message'

export const MessageContext = React.createContext({ message: null, setMessage: () => {} })

const useProjects = () => {
    console.log('useProjects runs... ')
    const [projects, setProjects] = useState([])

    useEffect(() => {
        ProjectService.getProjects().then(data => {
            setProjects(data.projects)
        })
    }, [])
    return projects
}

function Todos(props) {
    
    const [todo, setTodo] = useState({ item: '' })
    const [todos, setTodos] = useState([])
    // BEFORE IGHOST EDIT
    // const [createProject, setCreateProject] = useState({ name: '' })
    // const [projects, setProjects] = useState([])
    const [project, setProject] = useState('all-projects')
    const [projectName, setProjectName] = useState('All Projects')
    const projects = useProjects()
    const [message, setMessage] = useState(null)
    const authContext = useContext(AuthContext)


    useEffect(() => {
        TodoService.getTodos().then(data => {
            setTodos(data.todos)
        })
    },[])

    // BEFORE IGHOST EDIT
    // useEffect(() => {
    //     console.log('projects ...')
    //     ProjectService.getProjects().then(data => {
    //         setProjects(data.projects)
    //         // setProject(data.projects[0])
    //     })
    // },[])

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

    // function handleProjectCreateChange(createProject){
    //     console.log(createProject)
    //     setCreateProject(createProject)
    // }

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

    // BEFORE IGHOST EDIT
    // function handleProjectCreateSubmit(createProject){
    //     console.log('project: '+createProject)
    //     ProjectService.createProject(createProject).then(data => {
    //         const { message } = data
    //         console.log('data from handleProject submission: ')
    //         console.log(data)
            
    //         if(!message.msgError){
    //             console.log('Created new project!')
    //             resetProjectForm()
    //         }else{
    //             setMessage(message)
    //         }
    //     })
    // }

    function resetTodoForm(){
        setTodo({ item: '' })
    }

    // BEFORE IGHOST EDIT
    // function resetProjectForm(){
    //     console.log('trying to reset project form...')
    //     setCreateProject({ 'name': ''})
    // }


    function refreshTodoState(){
        ProjectService.getTodosByProject(project).then(data => {
            setTodos(data.todos)
        })
    }

    // function updateProjects(){
    //     console.log('updating projects...')
    //     useEffect(() => {
    //         console.log('projects ...')
    //         ProjectService.getProjects().then(data => {
    //             setProjects(data.projects)
    //             // setProject(data.projects[0])
    //         })
    //     },[])
    // }
   
    return (
        <MessageContext.Provider value={{ message, setMessage }}>
        <div>
            {/* <CreateProject 
                createProject={createProject} 
                onProjectCreateChange={handleProjectCreateChange} 
                onProjectCreateSubmit={handleProjectCreateSubmit} 
            /> */}
            
            <CreateProject onCreate={useProjects} />
            <hr />
            <SortProject projects={projects} onProjectSort={handleSortProjectChange} />
            <hr />
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
            <hr />

            <div style={{'background': 'cyan'}}>
                {
                    projects?.map(p =>{
                        return <p key={p._id}>Project: {p.name}</p>
                    })
                }
            </div>
            <hr />

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