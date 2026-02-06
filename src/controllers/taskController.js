const Task = require('../models/Task');
exports.getTasks = async (req, res) => {
  try {
    let tasks = req.user.role === 'admin' ? await Task.find().populate('createdBy', 'email') : await Task.find({ createdBy: req.user.id });
    res.status(200).json(tasks);
  } catch (err) { res.status(500).json({ message: 'Server Error' }); }
};
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(task);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(task);
  } catch (err) { res.status(400).json({ message: 'Error' }); }
};
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only Admins can delete any task; users can only delete their own.' });
    }
    await task.deleteOne();
    res.status(200).json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: 'Error' }); }
};