const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All task routes require a valid JWT
router.use(verifyToken); 

// Users can create and view their own tasks
router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);

// Users can update their own tasks
router.put('/:id', taskController.updateTask);

// Role-Based Access: Only Admins can delete tasks
router.delete('/:id', authorizeRoles('admin'), taskController.deleteTask);

module.exports = router;