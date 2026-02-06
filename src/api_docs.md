API Documentation - Anything AI Task Manager

Base URL: http://localhost:5000/api/v1

**1. Authentication**

Register User

URL: /auth/register

Method: POST

Body: { "email": "user@example.com", "password": "password123", "role": "user" }

Login User

URL: /auth/login

Method: POST

Body: { "email": "user@example.com", "password": "password123" }

Response: Returns JWT token and user object.

**2. Tasks (Protected Routes)**

Requires Header: Authorization: Bearer <JWT_TOKEN>

Get All Tasks

URL: /tasks

Method: GET

Access: - User: Returns only their own tasks.

Admin: Returns all tasks from all users.

**Create Task**

URL: /tasks

Method: POST

Body: { "title": "New Task", "description": "Task Details" }

Update Task

URL: /tasks/:id

Method: PUT

Body: { "title": "Updated", "status": "completed" }

**Delete Task**

URL: /tasks/:id

Method: DELETE

Logic: Admins can delete any task; Users can only delete their own.