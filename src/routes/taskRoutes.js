// const express = require('express');
// const router = express.Router();

// // Import the controller we just updated
// const taskController = require('../controllers/taskController');

// // Import your middleware
// const { verifyToken } = require('../middleware/authMiddleware');
// const { authorizeRoles } = require('../middleware/roleMiddleware');

// // --- Global Middleware for this Router ---
// // This ensures 'req.user' is populated before any logic runs
// router.use(verifyToken); 

// // --- Routes ---

// // Create a task & Get all tasks
// // Points to: taskController.createTask and taskController.getAllTasks
// router.route('/')
//     .post(taskController.createTask)
//     .get(taskController.getAllTasks);

// // Update and Delete specific tasks
// router.route('/:id')
//     .put(taskController.updateTask)
//     // Only admins can hit this delete route
//     .delete(authorizeRoles('admin'), taskController.deleteTask);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(authorize('admin'), deleteTask);

module.exports = router;