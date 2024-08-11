const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.getTasks)
      .get('/:id', taskController.getTaskById)
      .post('/', taskController.createTask)
      .delete('/:id', taskController.deleteTask)
      .patch('/:id',taskController.patchTask)
      .patch('/:id/verify', taskController.verifyTask);
          
module.exports = router;