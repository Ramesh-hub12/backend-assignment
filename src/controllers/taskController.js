// // const Task = require("../models/Task");

// // // CREATE: Add a new task
// // exports.createTask = async (req, res) => {
// //   try {
// //     const newTask = new Task({
// //       ...req.body,
// //       createdBy: req.user.id // Link task to the logged-in user
// //     });
// //     const savedTask = await newTask.save();
// //     res.status(201).json(savedTask);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // };

// // // READ: Get tasks based on role
// // exports.getAllTasks = async (req, res) => {
// //   try {
// //     // Logic: Admins see everything, Users see only their own tasks
// //     const filter = req.user.role === "admin" ? {} : { createdBy: req.user.id };
// //     const tasks = await Task.find(filter);
// //     res.json(tasks);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// // // UPDATE: Modify a task
// // exports.updateTask = async (req, res) => {
// //   try {
// //     const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
// //     res.json(updatedTask);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // };

// // // DELETE: Remove a task
// // exports.deleteTask = async (req, res) => {
// //   try {
// //     await Task.findByIdAndDelete(req.params.id);
// //     res.json({ message: "Task deleted successfully" });
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // };
// const Task = require('../models/Task');

// // @desc    Get all tasks for the logged-in user
// // @route   GET /api/v1/tasks
// exports.getTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find({ createdBy: req.user.id });
//     res.status(200).json(tasks);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch tasks' });
//   }
// };

// // @desc    Create a new task
// // @route   POST /api/v1/tasks
// exports.createTask = async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     const task = await Task.create({
//       title,
//       description,
//       createdBy: req.user.id
//     });

//     res.status(201).json(task);
//   } catch (err) {
//     res.status(400).json({ message: 'Failed to create task' });
//   }
// };

// // @desc    Delete a task (Admin Only)
// // @route   DELETE /api/v1/tasks/:id
// exports.deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     await task.deleteOne();
//     res.status(200).json({ message: 'Task removed successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error during deletion' });
//   }
// };
const Task = require('../models/task'); // Ensure this path matches your Task model

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            user: req.user.id // Associating task with the logged-in user
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// NOTE: This name MUST match your route: taskController.getAllTasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};