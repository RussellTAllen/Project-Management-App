const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    item: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Todo', TodoSchema)