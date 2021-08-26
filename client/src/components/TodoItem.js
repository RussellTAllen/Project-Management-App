import React from 'react'
import TodoService from '../services/TodoService'
// import Message from './Message'

function TodoItem(props) {
    const todoID = props.todo._id

    function handleRemove(e){
        // TodoService.removeTodo(todoID)
        //     .then(data => console.log(data))
        // .then(data => {
        //     console.log(data.message)
        //     if(data.message.msgError)
        //         console.log('error will robinson!')
        //         props.history.push('/')
        // })
        props.onRemove(todoID)
    }
    
    // Date Formatting
    let date = new Date(props.todo.created).toDateString()
    date = date.split('')
    date.splice(3, 0, ', ')
    date.splice(-5, 0, ', ')
    date = date.join('')

    let priorityStyle = getPriorityStyle()
    function getPriorityStyle(){
       if (props.todo.priority === 'Low') return 'green'
       if (props.todo.priority === 'Medium') return 'orange'
       return 'red' 
    }

    function handleCheckboxChange(){
        props.onToggleComplete(props.todo)
    }
    
    return (
        <tr>
            <td><input type="checkbox" onChange={handleCheckboxChange} checked={props.todo.completed} /></td>
            <td>{props.todo.item}</td>
            <td style={{color: priorityStyle}}>
                    {props.todo.priority}
            </td>
            <td>{date}</td>
            { 
            props.project === 'all-projects' ?
                <td>{props.todo.project.name}</td>
                : null
            }
            <td><button onClick={handleRemove}>Remove</button></td>
        </tr>
    )
}

export default TodoItem
