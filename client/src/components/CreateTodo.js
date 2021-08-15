import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import Message from './Message'
import TodoService from '../services/TodoService'
import ProjectService from '../services/ProjectService'

function CreateTodo(props) {    
    // const [todo, setTodo] = useState({ item: ''})
    // const [todos, setTodos] = useState([])
    // const [project, setProject] = useState(props.projects[0])
    const [message, setMessage] = useState(null)
    const authContext = useContext(AuthContext)


    function handleSubmit(e){
        e.preventDefault()
        console.log(props.project)

        // Lifting state up
        // TodoService.createTodo(todo, project).then(data => {
        //     const { message } = data
        //     resetForm()
        //     if(!message.msgError){
        //         TodoService.getTodos().then(data =>{
        //             console.log(data)
        //             setTodos(data.todos)
        //             setMessage(message)
        //         })
        //     }else if(message.msgBody === 'Unauthorized'){
        //         setMessage(message)
        //         authContext.setUser({ username: '', role: '' })
        //         authContext.setIsAuthenticated(false)
        //     }else{
        //         setMessage(message)
        //     }
        // })

        props.onTodoSubmit(props.todo, props.project)
    }

    function handleChange(e){
        // lifting state up
        // setTodo({ item: e.target.value })
        props.onTodoChange({ item: e.target.value })
    }

    // function selectProject(e){
    //     // lifting state up
    //     // setProject(e.target.value)
    //     console.log(e.target.value)
        
    //     props.onSelectProject({ _id: e.target.value })
    // }

    // function resetForm(){
    //     setTodo({ item: '' })
    // }

    return (
        <>
            {
                props.project !== 'all-projects' ?
            
                <form onSubmit={handleSubmit}>
                    <label htmlFor="todo">Enter Todo</label>
                    <input type="text" 
                            name="todo" 
                            value={props.todo.item} 
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter Todo"
                    />
                    {/* <select onChange={selectProject}>
                        {
                            props.projects.map(p => {
                                return <option value={p._id} key={p._id} name={p.name}>{p.name}</option>
                            })
                        }
                    </select> */}
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Submit</button>
                </form>
                // { message ? <Message message={message} /> : null }
                : <h4>You must select a project to add a todo item</h4>
            }       
        </>
    )
}

export default CreateTodo
