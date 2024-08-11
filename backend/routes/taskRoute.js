const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.getTasks)
      .get('/:id', taskController.getTaskById)
      .post('/', taskController.createTask)
      .delete('/:id', taskController.deleteTask)
      .patch('/:id',taskController.patchTask)
      .patch('/:id/verify', auth, isManager, async (req, res) => {
            try {
              const task = await Task.findById(req.params.taskId);
              if (!task) return res.status(404).json({ message: 'Task not found' });
          
              task.completed = true;
              await task.save();
          
              const employee = await Employee.findById(task.assignedTo);
              employee.totalPoints += task.points;
              await employee.save();
          
              res.json({ message: 'Task verified and employee points updated' });
            } catch (error) {
              res.status(500).json({ message: 'Server error' });
            }
          });
          
module.exports = router;