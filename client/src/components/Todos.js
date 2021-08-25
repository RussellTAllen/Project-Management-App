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
    const [rawTodos, setRawTodos] = useState([])
    const [createProject, setCreateProject] = useState({ name: '' })
    const [project, setProject] = useState('all-projects')
    const [priority, setPriority] = useState('Low')
    const [projectName, setProjectName] = useState('All Projects')
    const [projects, setProjects] = useState([])
    const [message, setMessage] = useState(null)
    const authContext = useContext(AuthContext)

    useEffect(() => {
        TodoService.getTodos().then(data => {
            setRawTodos(data.todos)
            setTodos(data.todos.filter(todo => clicked ? todo.completed : !todo.completed))
        })
    },[])

    useEffect(() => {
        ProjectService.getProjects().then(data => {
            setProjects(data.projects)
        })
    },[])

    function handleSortProjectChange(project, projectName){
        setProject(project)
        setProjectName(projectName)
        const filteredTodos = rawTodos
                                .filter(todo => project === 'all-projects' || todo.project._id === project)
                                .filter(todo => clicked ? todo.completed : !todo.completed)
        setTodos(filteredTodos)

        // CALLING DB TO SORT TODOS... not efficient
        // ProjectService.getTodosByProject(project).then(data => {
        //     setRawTodos(data.todos)
        //     const filteredTodos = data.todos.filter(todo => clicked ? todo.completed : !todo.completed)
        //     setTodos(filteredTodos)
        // })
    }

    function handleTodoChange(todo){
        setTodo(todo)
    }

    function handleProjectCreateChange(createProject){
        setCreateProject(createProject)
    }

    function handlePriorityChange(priority){
        setPriority(priority)
    }

    function handleTodoSubmit(todo, project, priority){
        TodoService.createTodo(todo, project, priority).then(data => {
            const { message } = data
            if(!message.msgError){
                ProjectService.getTodosByProject(project).then(data =>{
                    setRawTodos(data.todos)
                    const filteredTodos = data.todos.filter(todo => clicked ? todo.completed : !todo.completed)
                    setTodos(filteredTodos)
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
        ProjectService.createProject(createProject).then(data => {
            const { message } = data
            
            if(!message.msgError){
                ProjectService.getProjects().then(data => {
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
            setRawTodos(data.todos)
            const filteredTodos = data.todos.filter(todo => clicked ? todo.completed : !todo.completed)
            setTodos(filteredTodos)
        })
    }

    function sortByPriority(){
        const filteredTodos = rawTodos
                                .filter(todo => project === 'all-projects' || todo.project._id === project)
                                .filter(todo => !clicked ? !todo.completed : todo.completed)
                                .sort((a,b) => priorities[b.priority] - priorities[a.priority])
        setTodos(filteredTodos)

        // QUERY TO DB TO SORT ... not efficient
        // ProjectService.getTodosByProject(project).then(data => {
        //     setRawTodos(data.todos)
        //     const filteredTodos = data.todos.filter(todo => !clicked ? !todo.completed : todo.completed).sort((a,b) => priorities[b.priority] - priorities[a.priority])
        //     setTodos(filteredTodos)
        //     // setTodos(data.todos.filter(todo => !clicked ? !todo.completed : todo.completed).sort((a,b) => priorities[b.priority] - priorities[a.priority]))
        // })
    }
    
    function sortByRecentDate(){
        const filteredTodos = rawTodos
                                .filter(todo => project === 'all-projects' || todo.project._id === project)
                                .filter(todo => !clicked ? !todo.completed : todo.completed)
                                .sort((a,b) => a.created > b.created ? -1 : 1)
        setTodos(filteredTodos)
        // QUERY TO DB TO SORT ... not efficient
        // ProjectService.getTodosByProject(project).then(data => {
        //     setTodos(data.todos.filter(todo => !clicked ? !todo.completed : todo.completed).sort((a,b) => a.created > b.created ? -1 : 1))
        // })
    }

    function sortByOldestDate(){
        const filteredTodos = rawTodos
                                .filter(todo => project === 'all-projects' || todo.project._id === project)
                                .filter(todo => !clicked ? !todo.completed : todo.completed)
                                .sort((a,b) => a.created > b.created ? 1 : -1)
        setTodos(filteredTodos)

        // QUERY TO DB TO SORT ... not efficient
            // ProjectService.getTodosByProject(project).then(data => {
            //     setTodos(data.todos.filter(todo => !clicked ? !todo.completed : todo.completed).sort((a,b) => a.created > b.created ? 1 : -1))
            // })
    }

    function toggleActiveTodos(){
        const filteredTodos = rawTodos
                                .filter(todo => project === 'all-projects' || todo.project._id === project)
                                .filter(todo => clicked ? !todo.completed : todo.completed)
                                .sort((a,b) => priorities[b.priority] - priorities[a.priority])
        setTodos(filteredTodos)
        setClicked(prevState => !prevState)
    }

    function seeCompletedTodos(){
        console.log('seeCompletedTodos')
        
        console.log(todos)
        const filteredTodos = todos.filter(todo => todo.completed)
        console.log(filteredTodos)
        setTodos(todos => filteredTodos)
         
        setClicked(prevState => !prevState)
        console.log(clicked)
    }
        
    function seeActiveTodos(){
        console.log('seeActiveTodos')
        
        console.log(todos)
        const filteredTodos = todos.filter(todo => !todo.completed)
        console.log(filteredTodos)
        setTodos(todos => filteredTodos)
        
        setClicked(prevState => !prevState)
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
            {/* clicked ? seeActiveTodos : seeCompletedTodos */}
            {
            todos.length > 0 ?
                <div>
                    <h3>{clicked ? 'Completed' : 'Active'} Todos for <em>{projectName}</em></h3>
                    <button onClick={toggleActiveTodos}>
                        View {!clicked ? 'Completed' : 'Active'} Todos
                    </button>
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
                : null
            }
       </div>
    )
}

export default Todos