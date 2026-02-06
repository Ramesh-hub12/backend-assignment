Anything AI - Backend Developer Intern Project

A scalable Task Management System featuring JWT Authentication, Role-Based Access Control (RBAC), and a React-based Frontend.

 **Features**

Security: Password hashing with Bcrypt and secure JWT handling.

RBAC: Admin vs User permissions. Admins have global CRUD access.

Volatile Sessions: Enhanced security where sessions clear on page refresh.

Validation: Server-side input validation and error handling.

UI: Clean React interface with real-time search and inline error feedback.

**Tech Stack**

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Frontend: React.js, Lucide Icons

Auth: JSON Web Tokens (JWT)

**Installation & Setup**

Clone the repository:

git clone <your-repo-link>


Backend Setup:

cd backend
npm install
# Create a .env file with:
# PORT=5000
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_secret_key
npm run dev


Frontend Setup:

cd frontend
npm install
npm start


**API Documentation**

Refer to api_docs.md for full endpoint details and request examples.