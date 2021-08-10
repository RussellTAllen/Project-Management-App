export default {
    getProjects: () => {
        return fetch('/projects')
            .then(response => {
        // passport sends a 401 status if unathenticated
                if (response.status !== 401) {
                    return response.json().then(data => data)
                } else {
                    return { message: { msgBody: 'Unauthorized', msgError: true } }
                }
        })
    },
    createProject: project => {
        return fetch('/projects/createProject', {
            method: 'POST',
            body: JSON.stringify(project),
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
    // removeTodo: id => {
    //     return fetch('/todos/removeTodo', {
    //         method: 'DELETE',
    //         body: JSON.stringify({
    //             todoID: id
    //         }),
    //         headers: { 'Content-Type': 'application/json' }
    //     }).then(response => {
    //         if (response.status !== 401){
    //             return response.json().then(data => data)
    //         }else{
    //             return { message: { msgBody: 'Unauthorized', msgError: true }}
    //         }
    //     })
    // }
}