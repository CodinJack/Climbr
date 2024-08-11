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
  password: {
    type: String,
    required: true,
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  totalPoints: {
    type: Number,
    default: 0,
  },
  role: {
    type: String, 
    enum: ['employee', 'manager'],
    required: true
  },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
