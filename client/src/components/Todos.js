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
    const [todo, setTodo] = useState({ item: '' })
    const [todos, setTodos] = useState([])
    // const [selectedProject, setSelectedProject] = useState({})
    const [project, setProject] = useState({})
    const [projects, setProjects] = useState([])
    const [message, setMessage] = useState(null)
    const authContext = useContext(AuthContext)


    useEffect(() => {
        TodoService.getTodos().then(data => {
            setTodos(data.todos)
        })
    },[])
    
    // useEffect(() => {
    //     ProjectService.getTodosByProject().then(data => {
    //         setTodos(data.todos)
    //     })
    // },[])

    useEffect(() => {
        ProjectService.getProjects().then(data => {
            setProjects(data.projects)
            // setProject(data.projects[0])
        })
    },[projects])


    // useEffect(() => {
    //     setProject(projects[0])
    // }, [])

    // useEffect(() => {
    //     ProjectService.getProjects().then(data => {
    //         setSelectedProject(data.projects[0])
    //     })
    // },[])

    function handleSortProjectChange(e){
        console.log('handling project change...'+e.target.value)
        // setProject(e.t)

        setProject(e.target.value)

        ProjectService.getTodosByProject(e.target.value).then(data => {
            console.log(data)
            setTodos(data.todos)
        })
    }


    function handleTodoChange(todo){
        console.log(todo)
        setTodo(todo)
    }

    function handleProjectChange(project){
        console.log(project)
        setProject(project)
    }

    function handleTodoSubmit(todo, project){
        console.log(todo)
        console.log(project)
        TodoService.createTodo(todo, project).then(data => {
            const { message } = data
            resetForm()
            if(!message.msgError){
                ProjectService.getTodosByProject(project._id).then(data =>{
                    console.log(data)
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

    function handleProjectSubmit(project){
        console.log('project: '+project)
        ProjectService.createProject(project).then(data => {
            const { message } = data
            console.log('data from handleProject submission: ')
            console.log(data)
            
            if(!message.msgError){
                console.log('Created new project!')
                resetForm()
            }else{
                setMessage(message)
            }
        })
        resetForm()
    }

    // function handleSelectProject(project){
    //     console.log(project)
    //     setSelectedProject(project)
    // }

    function resetForm(){
        setProject({ name: '' })
    }
   
    return (
        <div>
            <CreateProject 
                project={project} 
                onProjectChange={handleProjectChange} 
                onProjectSubmit={handleProjectSubmit} 
            />

            <h4>Sort by project: </h4>
            <select onChange={handleSortProjectChange}>
                <option value="all-projects">All Projects</option>
                {
                    projects.map(p => {
                        return <option value={p._id} key={p._id}>{p.name}</option>
                    })
                }
            </select>

            <div>
                {
                    projects.map(p =>{
                        return <p key={p._id}>Project: {p.name}</p>
                    })
                }
            </div>

            <h3>Todos for <em>{project?.name}</em></h3>
            <ul className="list-group">
                {   
                    todos?.map(todo => {
                        return <TodoItem key={todo._id} todo={todo} />
                    })
                }
            </ul>

            <br />
           
            {
                projects.length > 0 ?
                    <CreateTodo 
                            todo={todo} 
                            project={project}
                            onTodoChange={handleTodoChange} 
                            onTodoSubmit={handleTodoSubmit} 
                            // onSelectProject={handleSelectProject} 
                    />
                    : <h3>To Create A Todo, First Create A Project</h3>
            }

       </div>
    )
}

export default Todos