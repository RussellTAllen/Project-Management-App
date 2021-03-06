const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const userRouter = require('./routes/user')
const todosRouter = require('./routes/todos')
const projectsRouter = require('./routes/projects')

require('dotenv').config({ path: './config/.env' })

app.use(cookieParser())
app.use(express.json())
app.use('/api/user', userRouter)
app.use('/api/todos', todosRouter)
app.use('/api/projects', projectsRouter)

mongoose.connect(process.env.MONGO_DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log('MongoDB connected!'))


app.listen(process.env.PORT, () => {
    console.log("Server running on port "+process.env.PORT)
})