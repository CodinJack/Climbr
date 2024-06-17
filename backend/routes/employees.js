const express = require('express');
const router = express.Router();
const emp = require('../controllers/employees'); 

router.get('/', employeeController.getEmployees)
      .get('/:id', employeeController.getEmployeeById)
      

module.exports = router;
