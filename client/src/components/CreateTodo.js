import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import Message from './Message'
import TodoService from '../services/TodoService'

function CreateTodo(props) {    
    const [todo, setTodo] = useState({ item: ''})
    const [todos, setTodos] = useState([])
    const [project, setProject] = useState(props.projects[0])
    const [message, setMessage] = useState(null)
    const authContext = useContext(AuthContext)


    function onSubmit(e){
        e.preventDefault()
        console.log('submit todo to project: '+project)
        TodoService.createTodo(todo, project).then(data => {
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

    function selectProject(e){
        setProject(e.target.value)
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
                <select onChange={selectProject}>
                    {
                        props.projects.map(p => {
                            return <option value={p._id} key={p._id}>{p.name}</option>
                        })
                    }
                </select>
                <button className="btn btn-lg btn-primary btn-block" type="submit">Submit</button>
            </form>
            { message ? <Message message={message} /> : null }
        </>
    )
}

export default CreateTodo
