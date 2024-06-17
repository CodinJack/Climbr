const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasks');

router.get('/', taskController.getTasks)
      .get('/:id', taskController.getTaskById)
      .post('/', taskController.createTask)
      .put('/:id', taskController.updateTask)
      .delete('/:id', taskController.deleteTask);

module.exports = router;