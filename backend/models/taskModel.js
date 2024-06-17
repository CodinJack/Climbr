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

TaskSchema.pre('save', async function (next) {
    const task = this;
    if (task.isModified('completed') && task.completed === true) {
        try {
            const assignedEmployee = await Employee.findById(task.assignedTo);
            if (!assignedEmployee) {
                throw new Error('Assigned employee not found');
            }
            assignedEmployee.totalPoints += task.points;
            await assignedEmployee.save(); 
        } catch (err) {
            console.error(err);
        }
    }
    next();
});


module.exports = mongoose.model('Task', TaskSchema);
