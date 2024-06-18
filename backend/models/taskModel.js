const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    dueDate: {
        type: Date,
    },
    difficulty: {
        type: String,
        enum: ["Hard", "Medium", "Easy"],
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    completed: {
        type: Boolean,
        default: false,
    },
    points: {
        type: Number,
        default: 0,
    },
});
  
module.exports = mongoose.model('Task', TaskSchema);
