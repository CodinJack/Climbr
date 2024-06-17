const express = require('express');
const router = express.Router();
const emp = require('../controllers/employees'); 

router.get('/', employeeController.getEmployees)
      .get('/:id', employeeController.getEmployeeById)
      .post('/', emp.createEmployee)
      .put('/:id', emp.updateEmployee)

module.exports = router;
