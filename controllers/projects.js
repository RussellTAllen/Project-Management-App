
const Todo = require('../models/Todo')
const User = require('../models/User')
const Project = require('../models/Project')


module.exports = {
    
    getProjects: async (req, res) => {
        User.findById({ _id: req.user._id }).populate('projects').exec((err, document)=>{
                if(err)
                    res.status(500).json({ message: { msgBody: 'Error has occured', msgError: true }})
                else{
                    res.status(200).json({ projects: document.projects, authenticated: true })
                }
        
            })
    },
    // getTodos: async (req, res) => {
    //     User.findById({ _id: req.user._id }).populate('todos').exec((err, document)=>{
    //             if(err)
    //                 res.status(500).json({ message: { msgBody: 'Error has occured', msgError: true }})
    //             else{
    //                 res.status(200).json({ todos: document.todos, authenticated: true })
    //             }
        
    //         })
    // },
    getTodosByProject: async (req, res) => {
        console.log('project id: '+req.params.id)
        User.findById({ _id: req.user._id }).populate('todos').exec((err, document)=>{
                    if(err)
                        res.status(500).json({ message: { msgBody: 'Error has occured', msgError: true }})
                    else{
                        console.log('controller todos: '+typeof document.todos[1].project)
                        console.log('controller todos: '+typeof req.params.id)
                        const projectTodos = document.todos.filter(todo => String(todo.project) === req.params.id)
                        res.status(200).json({ todos: projectTodos, authenticated: true })
                    }
                })
    },
    createProject: async (req, res) => {
        const project = new Project(req.body)
        await project.save(err=>{
            if(err)
                res.status(500).json({ message: { msgBody: 'Error has occured', msgError: true }})
            else{
                req.user.projects.push(project)
                req.user.save(err=>{
                    if (err)
                        res.status(500).json({ message: { msgBody: 'Error has occured', msgError: true }})
                    else
                        res.status(200).json({ message: { msgBody: 'Todo created!', msgError: false }})
                })
            }
        })
    },
}