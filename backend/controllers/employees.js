const Employee = require('../models/employeeModel');

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
exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        //find and delete all tasks assigned to this employee
        for (const taskId of employee.tasks) {
            await Task.findByIdAndDelete(taskId);
        }

        //delete the employee
        await Employee.findByIdAndDelete(id);

        res.json({ message: 'Employee and their tasks deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};