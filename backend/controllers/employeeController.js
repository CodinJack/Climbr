const Employee = require('../models/employeeModel');
const Task = require('../models/taskModel');

//get all employees
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//get a single employee by ID
exports.getEmployeeById = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//create a new employee
exports.createEmployee = async (req, res) => {
    const employee = new Employee(req.body);

    try {
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//delete an employee
exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        for (const taskId of employee.tasks) {
            await Task.findByIdAndDelete(taskId);
        }

        await Employee.findByIdAndDelete(id);

        res.json({ message: 'Employee and their tasks deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
  