export default {
    getTodos: () => {
        return fetch('/api/todos')
            .then(response => {
        // passport sends a 401 status if unathenticated
                if (response.status !== 401) {
                    return response.json().then(data => data)
                } else {
                    return { message: { msgBody: 'Unauthorized', msgError: true } }
                }
        })
    },
    createTodo: (todo, project, priority) => {
        console.log('todo service: ')
        console.log(todo, project, priority  )
        return fetch('/api/todos/addTodo', {
            method: 'POST',
            body: JSON.stringify({
                item: todo.item, 
                project: project,
                priority: priority
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status !== 401) {
                return response.json().then(data => data)
            } else {
                return { message: { msgBody: 'Unauthorized', msgError: true } }
            }
        })
    },
    toggleComplete: todoID => {
        console.log('todo service id:')
        console.log(todoID)
        return fetch('/api/todos/toggleComplete', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'todoID': todoID
            })
        }).then(response => {
            if (response.status !== 401){
                return response.json().then(data => data)
            }else{
                return { message: { msgBody: 'Unauthorized', msgError: true }}
            }
        })
    },
    removeTodo: id => {
        return fetch('/api/todos/removeTodo', {
            method: 'DELETE',
            body: JSON.stringify({
                todoID: id
            }),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            if (response.status !== 401){
                return response.json().then(data => data)
            }else{
                return { message: { msgBody: 'Unauthorized', msgError: true }}
            }
        })
    }
}