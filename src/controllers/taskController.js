const Task = require("../models/Task");

// CREATE: Add a new task
exports.createTask = async (req, res) => {
  try {
    const newTask = new Task({
      ...req.body,
      createdBy: req.user.id // Link task to the logged-in user
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ: Get tasks based on role
exports.getAllTasks = async (req, res) => {
  try {
    // Logic: Admins see everything, Users see only their own tasks
    const filter = req.user.role === "admin" ? {} : { createdBy: req.user.id };
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE: Modify a task
exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE: Remove a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};