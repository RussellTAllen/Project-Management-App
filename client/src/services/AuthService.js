export default {
    login: user => {
        return fetch('/api/user/login', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.status !== 401)
                return res.json().then(data => data)
            else{
                return { 
                    isAuthenticated: false, 
                    user: { username: '', role: '', todos: [], projects: [] },
                    message: { msgBody: 'Invalid username and/or password', msgError: true }
                }
            }
        })
    },
    register: user => {
        return fetch('/api/user/register', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => data)
    },
    logout: () => {
        return fetch('/api/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => data)
    },
    isAuthenticated: () => {
        return fetch('/api/user/authenticated')
                .then(res => {
                    if(res.status !== 401)
                        return res.json().then(data => data)
                    else
                        return { isAuthenticated: false, user: { username: '', role: '', todos: [], projects: [] }}
                })
    }
}