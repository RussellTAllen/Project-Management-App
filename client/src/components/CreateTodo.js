import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Message from './Message'
import TodoService from '../services/TodoService'



function CreateTodo() {    
    const [todo, setTodo] = useState({ item: '' })
    const [todos, setTodos] = useState([])
    const [message, setMessage] = useState(null)
    const authContext = useContext(AuthContext)
    
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

    function resetForm(){
        setTodo({ item: '' })
    }

    return (
        <>
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
        </>
    )
}

export default CreateTodo
