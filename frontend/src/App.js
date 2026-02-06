import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, LogOut, Shield, CheckCircle, Circle, Search, Edit2, X, Save } from 'lucide-react';

const API = 'https://anything-ai-backend.onrender.com/api/v1';

const App = () => {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (e) { 
      setErrorMsg("Connection to server failed."); 
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchTasks();
  }, [token, fetchTasks]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const path = isLogin ? 'login' : 'register';
    try {
      const res = await fetch(`${API}/auth/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        if (isLogin) {
          setToken(data.token);
          setUser(data.user);
        } else {
          setSuccessMsg("Account created successfully. Please login.");
          setIsLogin(true);
          setEmail('');
          setPassword('');
        }
      } else { 
        setErrorMsg(data.message || "Invalid credentials."); 
      }
    } catch (err) { 
      setErrorMsg("Authentication error."); 
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!title || !description) return;
    try {
      const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, description })
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        fetchTasks();
      } else {
        const data = await res.json();
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg("Failed to add task.");
    }
  };

  const saveEdit = async (id) => {
    setErrorMsg('');
    try {
      const res = await fetch(`${API}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: editTitle, description: editDesc })
      });
      if (res.ok) {
        setEditingId(null);
        fetchTasks();
      } else {
        const data = await res.json();
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg("Update failed.");
    }
  };

  const toggleTask = async (task) => {
    const s = task.status === 'completed' ? 'pending' : 'completed';
    await fetch(`${API}/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: s })
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    setErrorMsg('');
    try {
      const res = await fetch(`${API}/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTasks();
      } else {
        const data = await res.json();
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg("Delete failed.");
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="main">
      <style>{`
        .main { background: #f8fafc; min-height: 100vh; font-family: sans-serif; padding: 20px; color: #334155; }
        .card { background: white; max-width: 650px; margin: 40px auto; padding: 30px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .input { width: 100%; padding: 12px; margin: 8px 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-size: 15px; }
        .btn { width: 100%; padding: 12px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 10px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; margin-bottom: 20px; }
        .error-msg { color: #ef4444; font-size: 13px; margin-top: 5px; font-weight: bold; text-align: left; }
        .success-msg { color: #10b981; font-size: 13px; margin-bottom: 10px; font-weight: bold; text-align: center; }
        .task-row { border: 1px solid #f1f5f9; padding: 15px; border-radius: 10px; margin-bottom: 10px; }
        .task-content { display: flex; justify-content: space-between; align-items: flex-start; }
        .role-badge { font-size: 11px; font-weight: bold; color: #4f46e5; background: #eef2ff; padding: 3px 8px; border-radius: 4px; }
        .action-btn { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 5px; }
        .search-container { position: relative; flex: 1; }
        .search-icon { position: absolute; left: 10px; top: 18px; color: #94a3b8; }
        .search-input { padding-left: 35px; }
      `}</style>

      {!token ? (
        <div className="card" style={{ maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <Shield size={48} color="#4f46e5" />
            <h2>Task Manager</h2>
          </div>
          
          {successMsg && <div className="success-msg">{successMsg}</div>}

          <form onSubmit={handleAuth}>
            <input className="input" type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            
            {errorMsg && <div className="error-msg">⚠️ {errorMsg}</div>}

            {!isLogin && (
              <select className="input" value={role} onChange={e => setRole(e.target.value)}>
                <option value="user">User Role</option>
                <option value="admin">Admin Role</option>
              </select>
            )}
            <button className="btn" type="submit" style={{ marginTop: '20px' }}>{isLogin ? 'Sign In' : 'Create Account'}</button>
          </form>
          <p onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); setSuccessMsg(''); }} style={{ cursor: 'pointer', textAlign: 'center', marginTop: '15px', color: '#4f46e5', fontSize: '14px' }}>
            {isLogin ? 'New here? Register' : 'Already have an account? Login'}
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="header">
            <div>
              <h3 style={{ margin: 0 }}>Project Workspace</h3>
              <span className="role-badge">ROLE : {user?.role?.toUpperCase()}</span>
            </div>
            <button onClick={() => setToken('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <LogOut size={22} />
            </button>
          </div>
          
          {errorMsg && <div className="error-msg" style={{ marginBottom: '15px' }}>{errorMsg}</div>}

          <form onSubmit={addTask} style={{ marginBottom: '30px', background: '#f8fafc', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
            <input className="input" placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <input className="input" placeholder="Task Description" value={description} onChange={e => setDescription(e.target.value)} required />
            <button className="btn" type="submit">
              <Plus size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Add Task
            </button>
          </form>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input className="input search-input" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input" style={{ margin: 0, width: '130px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            {filteredTasks.map(t => (
              <div key={t._id} className="task-row">
                {editingId === t._id ? (
                  <div>
                    <input className="input" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                    <input className="input" value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                      <button className="btn" style={{ margin: 0, background: '#10b981', flex: 1 }} onClick={() => saveEdit(t._id)}>
                        <Save size={18} />
                      </button>
                      <button className="btn" style={{ margin: 0, background: '#94a3b8', flex: 1 }} onClick={() => setEditingId(null)}>
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="task-content">
                    <div style={{ display: 'flex', gap: '12px', cursor: 'pointer', flex: 1 }} onClick={() => toggleTask(t)}>
                      {t.status === 'completed' ? <CheckCircle color="#10b981" size={24} /> : <Circle color="#cbd5e1" size={24} />}
                      <div>
                        <div style={{ fontWeight: 'bold', textDecoration: t.status === 'completed' ? 'line-through' : 'none', color: t.status === 'completed' ? '#94a3b8' : '#1e293b' }}>
                          {t.title} {user?.role === 'admin' && <small style={{ color: '#94a3b8' }}>({t.createdBy?.email})</small>}
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>{t.description}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button className="action-btn" onClick={() => {
                        setEditingId(t._id);
                        setEditTitle(t.title);
                        setEditDesc(t.description);
                      }}><Edit2 size={18} /></button>
                      <button className="action-btn" style={{ color: '#f87171' }} onClick={() => deleteTask(t._id)}><Trash2 size={18} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;