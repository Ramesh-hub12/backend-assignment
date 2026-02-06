// const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//   title: { 
//     type: String, 
//     required: true, 
//     trim: true 
//   }, 
//   description: { 
//     type: String 
//   }, 
//   status: { 
//     type: String, 
//     enum: ['pending', 'completed'], 
//     default: 'pending' 
//   },
//   createdBy: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: true 
//   } 
// }, { timestamps: true });

// module.exports = mongoose.model('Task', taskSchema);

const mongoose = require('mongoose');

/**
 * TASK SCHEMA (Secondary Entity)
 * Represents the objects being managed by the users.
 */
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  // RELATIONSHIP: Links each task to a specific User
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Task', taskSchema);