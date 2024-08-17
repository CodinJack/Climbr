const Task = require('../models/taskModel');
const Employee = require('../models/employeeModel');

// Get all tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single task by ID
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

// Create a new task
exports.createTask = async (req, res) => {
    const task = new Task(req.body);

    try {
        const newTask = await task.save();
        if (req.body.assignedTo) {
            const employee = await Employee.findByIdAndUpdate(
                req.body.assignedTo,
                { $push: { tasks: newTask._id } },
                { new: true }
            ).populate('tasks');
            if (!employee) {
                return res.status(404).json({ message: "Employee not found" });
            }
        }
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a task by ID
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

// Patch (update) a task
exports.patchTask = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (updates.completed) {
            const assignedEmployee = await Employee.findById(updatedTask.assignedTo);
            if (assignedEmployee) {
                assignedEmployee.totalPoints += updatedTask.points;
                await assignedEmployee.save();
            }
        }
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message }); // Handle errors appropriately
    }
};

// Verify task (mark as completed and update employee points)
exports.verifyTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.completed = true;
        await task.save();

        if (task.assignedTo) {
            const employee = await Employee.findById(task.assignedTo);
            if (employee) {
                employee.totalPoints += task.points;
                await employee.save();
            } else {
                // Handle case where the assigned employee is not found
                console.warn(`Employee with ID ${task.assignedTo} not found.`);
            }
        }

        res.json({ message: 'Task verified and employee points updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
