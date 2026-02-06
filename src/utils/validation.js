const Joi = require('joi');

// Schema for user registration [cite: 11, 27]
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').default('user') [cite: 12]
});

// Schema for task creation [cite: 13, 27]
const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  status: Joi.string().valid('pending', 'completed').default('pending')
});

module.exports = { registerSchema, taskSchema };