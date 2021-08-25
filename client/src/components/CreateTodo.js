import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
// import Message from './Message'
// import TodoService from '../services/TodoService'
// import ProjectService from '../services/ProjectService'

function CreateTodo(props) {    
    // const [todo, setTodo] = useState({ item: ''})
    // const [todos, setTodos] = useState([])
    // const [project, setProject] = useState(props.projects[0])
    // const [message, setMessage] = useState(null)
    const authContext = useContext(AuthContext)

    function handleSubmit(e){
        e.preventDefault()
        console.log(props.project)
        props.onTodoSubmit(props.todo, props.project, props.priority)
    }

    function handleChange(e){
        props.onTodoChange({ item: e.target.value })
    }
    
    function handlePriorityChange(e){
        props.onPriorityChange(e.target.value )
    }
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
                    <label htmlFor="priority">Priority: </label>
                    <select onChange={handlePriorityChange} name="priority">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>URGENT</option>
                    </select>
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Submit</button>
                </form>
                : <h4>You must select a project to add a todo item</h4>
                // { message ? <Message message={message} /> : null }
            }       
        </>
    )
}

export default CreateTodo
