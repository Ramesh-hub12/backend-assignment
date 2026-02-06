import React, { useEffect, useState } from 'react';
import { getTasks, createTask, deleteTask } from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const loadTasks = async () => {
    try {
      const { data } = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTask({ title });
      setTitle('');
      loadTasks();
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (err) {
      alert("Only Admins can delete tasks!");
    }
  };

  return (
    <div className="dashboard">
      <h3>Manage Your Tasks</h3>
      <form onSubmit={handleCreate} style={{marginBottom: '20px'}}>
        <input value={title} placeholder="New Task Title" 
          onChange={(e) => setTitle(e.target.value)} required />
        <button type="submit" style={{marginLeft: '10px'}}>Add Task</button>
      </form>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task._id} style={{borderBottom: '1px solid #ddd', padding: '10px', display: 'flex', justifyContent: 'space-between'}}>
            <span>{task.title}</span>
            <button onClick={() => handleDelete(task._id)} style={{color: 'red'}}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;