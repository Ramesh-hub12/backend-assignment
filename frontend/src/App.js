// import React, { useState, useEffect } from 'react';
// import { Trash2, LogOut, Shield, } from 'lucide-react';

// const API_URL = 'http://localhost:5000/api/v1';

// const App = () => {
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [tasks, setTasks] = useState([]);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLogin, setIsLogin] = useState(true);
//   const [newTask, setNewTask] = useState('');

//   useEffect(() => {
//     if (token) fetchTasks();
//   }, [token]);

//   const fetchTasks = async () => {
//     try {
//       const res = await fetch(`${API_URL}/tasks`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await res.json();
//       setTasks(Array.isArray(data) ? data : []);
//     } catch (e) { console.log(e); }
//   };

//   const handleAuth = async (e) => {
//     e.preventDefault();
//     const path = isLogin ? 'login' : 'register';
//     const res = await fetch(`${API_URL}/auth/${path}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password, role: 'admin' })
//     });
//     const data = await res.json();
//     if (res.ok && isLogin) {
//       localStorage.setItem('token', data.token);
//       setToken(data.token);
//     } else if (res.ok) {
//       alert("Account created! Please login.");
//       setIsLogin(true);
//     } else {
//       alert(data.message);
//     }
//   };

//   const handleAddTask = async (e) => {
//     e.preventDefault();
//     if (!newTask) return;
//     const res = await fetch(`${API_URL}/tasks`, {
//       method: 'POST',
//       headers: { 
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}` 
//       },
//       body: JSON.stringify({ title: newTask })
//     });
//     if (res.ok) {
//       setNewTask('');
//       fetchTasks();
//     } else {
//       const err = await res.json();
//       alert(err.message);
//     }
//   };

//   const deleteTask = async (id) => {
//     const res = await fetch(`${API_URL}/tasks/${id}`, {
//       method: 'DELETE',
//       headers: { 'Authorization': `Bearer ${token}` }
//     });
//     if (res.ok) fetchTasks();
//     else alert("Action denied.");
//   };

//   return (
//     <div className="container">
//       <style>{`
//         .container { background-color: #f4f7f6; min-height: 100vh; font-family: Arial, sans-serif; color: #333; padding: 20px; }
//         .auth-card { background: white; max-width: 350px; margin: 80px auto; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
//         .input-group { margin-bottom: 15px; text-align: left; }
//         input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
//         .btn { width: 100%; padding: 10px; background-color: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin-top: 10px; }
//         .btn:hover { background-color: #4338ca; }
//         .dashboard { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
//         .task-list { list-style: none; padding: 0; }
//         .task-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #eee; }
//         .task-item:last-child { border-bottom: none; }
//         .delete-btn { background: none; border: none; color: #ef4444; cursor: pointer; }
//         .nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
//       `}</style>

//       {!token ? (
//         <div className="auth-card">
//           <Shield size={40} color="#4f46e5" style={{ marginBottom: '10px' }} />
//           <h2>Anything AI</h2>
//           <p>{isLogin ? 'Welcome back!' : 'Create an account'}</p>
//           <form onSubmit={handleAuth}>
//             <div className="input-group">
//               <input type="email" placeholder="Email Address" onChange={e => setEmail(e.target.value)} required />
//             </div>
//             <div className="input-group">
//               <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
//             </div>
//             <button className="btn" type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
//           </form>
//           <p style={{ marginTop: '20px', fontSize: '14px', cursor: 'pointer', color: '#6366f1' }} onClick={() => setIsLogin(!isLogin)}>
//             {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
//           </p>
//         </div>
//       ) : (
//         <div className="dashboard">
//           <div className="nav">
//             <h2 style={{ margin: 0 }}>My Tasks</h2>
//             <button onClick={() => { localStorage.removeItem('token'); setToken(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
//               <LogOut color="#666" />
//             </button>
//           </div>

//           <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
//             <input 
//               style={{ margin: 0 }}
//               placeholder="What needs to be done?" 
//               value={newTask} 
//               onChange={e => setNewTask(e.target.value)} 
//             />
//             <button className="btn" style={{ width: '80px', marginTop: 0 }} type="submit">Add</button>
//           </form>

//           <ul className="task-list">
//             {tasks.length === 0 && <p style={{ textAlign: 'center', color: '#999' }}>No tasks found.</p>}
//             {tasks.map(task => (
//               <li key={task._id} className="task-item">
//                 <span>{task.title}</span>
//                 <button className="delete-btn" onClick={() => deleteTask(task._id)}>
//                   <Trash2 size={18} />
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, LogOut, Shield, CheckCircle2, Circle } from 'lucide-react';

const BASE_URL = 'http://localhost:5000/api/v1';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [newTask, setNewTask] = useState('');

  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }), [token]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/tasks`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Session expired");
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) { 
      if (e.message === "Session expired") {
        localStorage.removeItem('token');
        setToken(null);
      }
    } finally { setLoading(false); }
  }, [getHeaders]);

  useEffect(() => {
    if (token) fetchTasks();
  }, [token, fetchTasks]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? 'login' : 'register';
    try {
      const res = await fetch(`${BASE_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Auth failed");
      
      if (isLogin) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        alert("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title: newTask })
      });
      if (res.ok) {
        setNewTask('');
        fetchTasks();
      } else {
        const errorData = await res.json();
        alert(errorData.message);
      }
    } catch (e) {
      alert("Error adding task.");
    }
  };

  const toggleTaskStatus = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await fetch(`${BASE_URL}/tasks/${task._id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: nextStatus })
      });
      fetchTasks();
    } catch (e) {
      console.error("Update failed");
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/tasks/${id}`, { 
        method: 'DELETE', 
        headers: getHeaders() 
      });
      
      if (res.ok) {
        fetchTasks();
      } else {
        const data = await res.json();
        // Specifically handles the RBAC 'admin' check feedback
        alert(data.message || "Permission Denied: Only Admins can delete tasks.");
      }
    } catch (e) {
      alert("Error deleting task.");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setTasks([]);
  };

  return (
    <div className="wrapper">
      <style>{`
        .wrapper { background: #f8fafc; min-height: 100vh; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #1e293b; }
        .auth-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 100%; max-width: 380px; margin: 80px auto; text-align: center; border: 1px solid #e2e8f0; }
        .title { font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #0f172a; }
        .subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
        .input { width: 100%; padding: 12px; margin: 8px 0; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; font-size: 15px; }
        .btn { width: 100%; padding: 12px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 16px; margin-top: 10px; transition: background 0.2s; }
        .btn:hover { background: #4338ca; }
        .dashboard { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #e2e8f0; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
        .task-list { margin-top: 20px; }
        .task-row { display: flex; justify-content: space-between; align-items: center; padding: 14px; border: 1px solid #f1f5f9; border-radius: 10px; margin-bottom: 10px; transition: transform 0.1s; }
        .task-row:hover { background: #f8fafc; }
        .task-info { display: flex; align-items: center; gap: 12px; cursor: pointer; flex: 1; }
        .task-text { font-size: 16px; font-weight: 500; }
        .completed { text-decoration: line-through; color: #94a3b8; }
        .delete-btn { background: none; border: none; color: #94a3b8; cursor: pointer; padding: 5px; transition: color 0.2s; }
        .delete-btn:hover { color: #ef4444; }
        .empty-state { text-align: center; color: #94a3b8; padding: 40px 0; }
      `}</style>

      {!token ? (
        <div className="auth-card">
          <Shield size={48} color="#4f46e5" style={{ marginBottom: '15px' }} />
          <div className="title">Anything AI</div>
          <div className="subtitle">{isLogin ? 'Sign in to access your tasks' : 'Create a new account'}</div>
          <form onSubmit={handleAuth}>
            <input type="email" placeholder="Email Address" className="input" onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="input" onChange={e => setPassword(e.target.value)} required />
            {!isLogin && (
              <select className="input" onChange={e => setRole(e.target.value)}>
                <option value="user">User Role (Can't Delete)</option>
                <option value="admin">Admin Role (Can Delete)</option>
              </select>
            )}
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
          <div style={{ marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
            {isLogin ? "New here?" : "Already have an account?"} 
            <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#4f46e5', cursor: 'pointer', marginLeft: '5px', fontWeight: '600' }}>
              {isLogin ? 'Register' : 'Login'}
            </span>
          </div>
        </div>
      ) : (
        <div className="dashboard">
          <div className="header">
            <h2 style={{ margin: 0, fontSize: '22px' }}>Workspace</h2>
            <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <LogOut size={22} />
            </button>
          </div>

          <form onSubmit={addTask} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <input 
              className="input" 
              style={{ margin: 0, flex: 1 }} 
              placeholder="Add a new objective..." 
              value={newTask} 
              onChange={e => setNewTask(e.target.value)} 
            />
            <button className="btn" style={{ width: '90px', marginTop: 0 }} type="submit">
              <Plus size={20} />
            </button>
          </form>

          <div className="task-list">
            {tasks.length === 0 && !loading && (
              <div className="empty-state">
                <p>No tasks found. Add one above!</p>
              </div>
            )}
            
            {tasks.map(task => (
              <div key={task._id} className="task-row">
                <div className="task-info" onClick={() => toggleTaskStatus(task)}>
                  {task.status === 'completed' ? (
                    <CheckCircle2 color="#10b981" size={20} />
                  ) : (
                    <Circle color="#cbd5e1" size={20} />
                  )}
                  <span className={`task-text ${task.status === 'completed' ? 'completed' : ''}`}>
                    {task.title}
                  </span>
                </div>
                <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;