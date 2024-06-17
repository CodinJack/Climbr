const express = require('express');
const router = express.Router();
const employeeController  = require('../controllers/employees'); 

router.get('/', employeeController.getEmployees)
      .get('/:id', employeeController.getEmployeeById)
      .post('/', employeeController.createEmployee)
      .put('/:id', employeeController.updateEmployee)

module.exports = router;
