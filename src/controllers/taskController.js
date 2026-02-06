// const Task = require('../models/Task');

// exports.getTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find({ createdBy: req.user.id });
//     res.status(200).json(tasks);
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };

// exports.createTask = async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     if (!title) return res.status(400).json({ message: 'Title is required' });
    
//     const task = await Task.create({
//       title,
//       description,
//       createdBy: req.user.id 
//     });
//     res.status(201).json(task);
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// exports.updateTask = async (req, res) => {
//   try {
//     let task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ message: 'Not found' });
    
//     task = await Task.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.status(200).json(task);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// exports.deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ message: 'Not found' });
    
//     await task.deleteOne();
//     res.status(200).json({ success: true, message: 'Deleted' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };

const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title } = req.body;
    
    // THIS LINE FIXES THE ERROR IN YOUR SCREENSHOT
    // It links the task to the logged-in user's ID
    const task = await Task.create({
      title,
      createdBy: req.user.id 
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};