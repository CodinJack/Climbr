const Task = require('../models/taskModel');
const Employee = require('../models/employeeModel');
//get all tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//get a single task by ID
exports.getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//create a new task
exports.createTask = async (req, res) => {
    const task = new Task(req.body);

    try {
        const newTask = await task.save();
        const employee = await Employee.findByIdAndUpdate(
            req.body.assignedTo,
            { $push: { tasks: newTask._id } },
            { new: true }
        ).populate('tasks');
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//delete a task by ID
exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (deletedTask.assignedTo) {
            const assignedEmployee = await Employee.findById(deletedTask.assignedTo);

            if (assignedEmployee) {
                assignedEmployee.tasks.pull(deletedTask._id);
                await assignedEmployee.save();
            }
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.patchTask = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (updates.completed) {
            console.log("Fix")
            const assignedEmployee = await Employee.findById(updatedTask.assignedTo);
            if (!assignedEmployee) {
                throw new Error('Assigned employee not found');
            }
            assignedEmployee.totalPoints += updatedTask.points;
            await assignedEmployee.save();
            if (assignedEmployee.tasks && assignedEmployee.tasks.length > 0) {
                const taskIndex = assignedEmployee.tasks.indexOf(updatedTask._id.toString());
                if (taskIndex !== -1) {
                    assignedEmployee.tasks.splice(taskIndex, 1);
                }
                updatedTask.assignedTo=null;
            }
            await assignedEmployee.save();
        }
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message }); // Handle errors appropriately
    }
};
