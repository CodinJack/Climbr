const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Employee = require('../models/employeeModel');

exports.login = async (req, res) => {
  const { employeeID, password, role } = req.body;

  try {
    const employee = await Employee.findOne({ employeeID });
    if (!employee) {
      return res.status(400).json({ message: 'Employee not found' });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch || employee.role !== role) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Generated Token:', token);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.signupManager = async (req, res) => {
  const { employeeID, name, password } = req.body;

  try {
    if (!employeeID || !name || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    let employee = await Employee.findOne({ employeeID });
    if (employee) {
      return res.status(400).json({ message: 'Manager with this ID already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    employee = new Employee({
      employeeID,
      name,
      password: hashedPassword,
      role: 'manager',
    });
    const token = jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await employee.save();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
