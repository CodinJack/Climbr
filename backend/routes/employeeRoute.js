const express = require('express');
const router = express.Router();
const employeeController  = require('../controllers/employeeController'); 

router.get('/', employeeController.getEmployees)
      .get('/:id', employeeController.getEmployeeById)
      .post('/', employeeController.createEmployee)
      .delete('/:id', employeeController.deleteEmployee)

module.exports = router;
