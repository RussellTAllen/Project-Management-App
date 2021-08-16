import React from 'react'
import TodoService from '../services/TodoService'
// import Message from './Message'

function TodoItem(props) {
    const todoID = props.todo._id

    function handleRemove(e){
        TodoService.removeTodo(todoID)
            .then(data => console.log(data))
        // .then(data => {
        //     console.log(data.message)
        //     if(data.message.msgError)
        //         // props.history.push('/')
        //         console.log('error will robinson!')
        //         props.history.push('/')
        // })

        props.onRemove()
    }

    return (
        <li>
            {props.todo.item}
            <button onClick={handleRemove}>Remove</button>
        </li>
    )
}

export default TodoItem
