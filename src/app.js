const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./utils/errorHandler');

dotenv.config();

connectDB();

const app = express();

// 3. Global Middleware
app.use(express.json()); // Parses incoming JSON 
app.use(cors()); // Enables Cross-Origin Resource Sharing 

// 4. API Routes with Versioning [cite: 14, 3]
app.use('/api/v1/auth', require('./routes/authRoutes')); 
app.use('/api/v1/tasks', require('./routes/taskRoutes')); 

// 5. Global Error Handling Middleware [cite: 14, 3]
app.use(errorHandler);

// 6. Server Initialization 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});