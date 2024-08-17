const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const employeeController  = require('../controllers/employeeController'); 

router.get('/', employeeController.getEmployees)
      .get('/:id', employeeController.getEmployeeById)
      .post('/', employeeController.createEmployee)
      .delete('/:id', employeeController.deleteEmployee)
      .get('/user-role', employeeController.getUserRole);

module.exports = router;