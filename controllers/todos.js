
const Todo = require('../models/Todo')
const User = require('../models/User')


module.exports = {
    getTodos: async (req, res) => {
        User.findById({ _id: req.user._id }).populate('todos').exec((err, document)=>{
                if(err)
                    res.status(500).json({ message: { msgBody: 'Error has occured', msgError: true }})
                else{
                    res.status(200).json({ todos: document.todos, authenticated: true })
                }
        
            })
    },
    addTodo: async (req, res) => {
        // try{
        //     await Todo.create({
        //         item: req.body.item
        //     })
        //     await User.updateOne({ _id: req.user._id },
        //         {
        //             $push: { todos: req.body }
        //         }
        //     )
        //     console.log('Todo added')
        //     res.json('Todo added')
        // }catch(err){
        //     console.log(err)
        // }
        
        const todo = new Todo(req.body)
        await todo.save(err=>{
            if(err)
                res.status(500).json({ message: { msgBody: 'Error has occured', msgError: true }})
            else{
                req.user.todos.push(todo)
                req.user.save(err=>{
                    if (err)
                        res.status(500).json({ message: { msgBody: 'Error has occured', msgError: true }})
                    else
                        res.status(200).json({ message: { msgBody: 'Todo created!', msgError: false }})
                })
            }
        })
    },
    removeTodo: async (req, res) => {
        console.log('controller removeTodo running...')
        try{
            await Todo.findOneAndDelete({ _id: req.body.todoID })

            const user = await User.findById(req.user._id)
            user.todos.splice(user.todos.indexOf(req.body.todoID), 1)
            user.save()

            console.log('Deleted Todo')
            res.json('Deleted Todo')
        }catch(err){
            res.status(500).json({ message: { msgBody: 'Error has occured', msgError: true }})
        }
    }
    
}