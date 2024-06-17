const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    employeeID: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    totalPoints: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
