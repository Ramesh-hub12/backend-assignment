import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  LogOut, 
  CheckCircle2, 
  Circle, 
  Shield, 
  Loader2,
  Mail,
  Lock,
  ChevronDown,
  ChevronUp,
  BrainCircuit
} from 'lucide-react';

/**
 * GEMINI AI CONFIGURATION
 * These functions power the "Smart" features of the workspace.
 */
const apiKey = ""; // API Key provided by the environment
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

const fetchGemini = async (prompt, systemInstruction = "") => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  const retryFetch = async (retries = 0) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('API Error');
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    } catch (err) {
      if (retries < 5) {
        await new Promise(r => setTimeout(r, Math.pow(2, retries) * 1000));
        return retryFetch(retries + 1);
      }
      throw err;
    }
  };
  return retryFetch();
};

/**
 * BACKEND SERVICE CONFIG
 * Using fetch directly in one file to prevent "Module not found" path errors.
 */
const BASE_URL = 'http://localhost:5000/api/v1';
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [newTask, setNewTask] = useState('');
  
  // AI States
  const [aiInsights, setAiInsights] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [breakdowns, setBreakdowns] = useState({});
  const [aiWorking, setAiWorking] = useState(null);

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/tasks`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setTasks(data);
      if (data.length > 0) getInsights(data);
    } catch (e) { 
      console.error(e); 
      if (e.message === "Unauthorized") logout();
    } finally { setLoading(false); }
  };

  const getInsights = async (currentTasks) => {
    const titles = currentTasks.slice(0, 5).map(t => t.title).join(", ");
    try {
      const insight = await fetchGemini(`Review these tasks: ${titles}. Provide a 1-sentence motivational insight for a professional workspace.`, "You are a productivity coach.");
      setAiInsights(insight);
    } catch (e) { setAiInsights("Operational efficiency confirmed. Ready for new objectives."); }
  };

  const handleMagicRefine = async () => {
    if (!newTask) return;
    setAiWorking('refine');
    try {
      const refined = await fetchGemini(`Professionalize this task title: "${newTask}". Return ONLY the new title.`);
      setNewTask(refined.replace(/["']/g, "").trim());
    } finally { setAiWorking(null); }
  };

  const handleBreakdown = async (task) => {
    if (expandedId === task._id) { setExpandedId(null); return; }
    if (breakdowns[task._id]) { setExpandedId(task._id); return; }
    
    setAiWorking(task._id);
    try {
      const result = await fetchGemini(`For the task "${task.title}", provide 3 bullet points on how to complete it.`, "Project manager.");
      setBreakdowns(prev => ({ ...prev, [task._id]: result }));
      setExpandedId(task._id);
    } finally { setAiWorking(null); }
  };

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
      
      if (!res.ok) throw new Error(data.message || "Authentication failed");

      if (isLogin) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        }
      } else {
        alert("Registration Successful! Please sign in with your credentials.");
        setIsLogin(true);
      }
    } catch (err) { 
      alert(err.message); 
    } finally { setLoading(false); }
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
      }
    } catch (e) { console.error(e); }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE', headers: getHeaders() });
      if (res.ok) fetchTasks();
      else {
        const data = await res.json();
        alert(data.message || "Unauthorized: Admin access required.");
      }
    } catch (e) { console.error(e); }
  };

  const logout = () => { localStorage.removeItem('token'); setToken(null); setAiInsights(""); };

  const styles = `
    .app-container { background: #0f172a; min-height: 100vh; color: #f8fafc; font-family: 'Inter', sans-serif; }
    .auth-card { background: #1e293b; padding: 2.5rem; border-radius: 1.5rem; width: 100%; max-width: 400px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); border: 1px solid #334155; }
    .input-field { width: 100%; background: #020617; border: 1px solid #334155; border-radius: 0.75rem; padding: 0.85rem 1rem 0.85rem 2.5rem; color: white; transition: 0.2s; box-sizing: border-box; font-size: 0.95rem; }
    .input-field:focus { outline: 2px solid #6366f1; border-color: transparent; }
    .primary-btn { width: 100%; background: #6366f1; color: white; border: none; padding: 0.85rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .primary-btn:hover { background: #4f46e5; transform: translateY(-1px); }
    .task-item { background: #1e293b; border: 1px solid #334155; border-radius: 1.25rem; padding: 1.25rem; margin-bottom: 1rem; transition: 0.2s; }
    .task-item:hover { border-color: #6366f1; background: #232f45; }
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: rgba(2, 6, 23, 0.8); backdrop-filter: blur(10px); border-bottom: 1px solid #334155; position: sticky; top: 0; z-index: 100; }
    .ai-badge { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; padding: 0.35rem 0.65rem; border-radius: 0.5rem; font-size: 0.65rem; font-weight: 800; display: flex; align-items: center; gap: 6px; letter-spacing: 0.05em; border: 1px solid rgba(99, 102, 241, 0.2); }
    .ai-insight-box { border-left: 4px solid #6366f1; background: rgba(99, 102, 241, 0.03); padding: 1.5rem; border-radius: 0 1.25rem 1.25rem 0; margin-bottom: 2.5rem; }
  `;

  return (
    <div className="app-container">
      <style>{styles}</style>
      
      {!token ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem' }}>
          <div className="auth-card">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ background: '#6366f1', display: 'inline-block', padding: '0.75rem', borderRadius: '1rem', marginBottom: '1.25rem' }}>
                <Shield size={32} color="white" />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Anything AI</h2>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>{isLogin ? 'Access your intelligence-driven workspace' : 'Join our high-performance workforce'}</p>
            </div>
            
            <form onSubmit={handleAuth}>
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Mail style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748b' }} size={18} />
                <input type="email" placeholder="Work Email" className="input-field" onChange={e => setEmail(e.target.value)} required />
              </div>
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Lock style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748b' }} size={18} />
                <input type="password" placeholder="Password" className="input-field" onChange={e => setPassword(e.target.value)} required />
              </div>
              {!isLogin && (
                <div style={{ marginBottom: '1rem' }}>
                  <select className="input-field" style={{ paddingLeft: '1rem' }} onChange={e => setRole(e.target.value)}>
                    <option value="user">Assign User Role</option>
                    <option value="admin">Assign Admin Role</option>
                  </select>
                </div>
              )}
              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? <Loader2 size={20} className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#94a3b8', cursor: 'pointer', fontWeight: '500' }} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Join the AI workforce? Register' : 'Existing staff? Login'}
            </p>
          </div>
        </div>
      ) : (
        <>
          <nav className="navbar">
            <div style={{ fontWeight: '900', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BrainCircuit size={24} color="#6366f1" /> Anything AI
            </div>
            <button onClick={logout} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#f87171', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}>
              <LogOut size={20} />
            </button>
          </nav>

          <main style={{ max_width: '650px', margin: '3rem auto', padding: '0 1.5rem' }}>
            {aiInsights && (
              <div className="ai-insight-box">
                <div className="ai-badge" style={{ marginBottom: '10px', width: 'fit-content' }}>
                  <Sparkles size={12} /> WORKSPACE INSIGHTS
                </div>
                <div style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#e2e8f0' }}>"{aiInsights}"</div>
              </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>Mission Control</h1>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Securely managing objective modules.</p>
            </div>

            <form onSubmit={addTask} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1.25rem', padding: '0.25rem', display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
              <input 
                style={{ flex: 1, background: 'transparent', border: 'none', padding: '1rem 1.5rem', color: 'white', fontSize: '1.1rem', outline: 'none' }}
                placeholder="Draft a new objective..." 
                value={newTask} 
                onChange={e => setNewTask(e.target.value)} 
              />
              <button 
                type="button" 
                onClick={handleMagicRefine}
                style={{ background: 'transparent', border: 'none', color: '#818cf8', cursor: 'pointer', padding: '10px' }}
              >
                {aiWorking === 'refine' ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              </button>
              <button className="primary-btn" style={{ width: '48px', height: '48px', padding: 0, borderRadius: '1rem', margin: '4px' }} type="submit">
                <Plus size={24} />
              </button>
            </form>

            <div>
              {tasks.map(task => (
                <div key={task._id} className="task-item">
                  <div style={{ display: 'flex', justify_content: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', items_center: 'center', gap: '16px' }}>
                      {task.status === 'completed' ? <CheckCircle2 color="#10b981" /> : <Circle color="#334155" />}
                      <span style={{ fontWeight: 600, fontSize: '1.1rem', color: task.status === 'completed' ? '#64748b' : 'white' }}>{task.title}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        onClick={() => handleBreakdown(task)}
                        style={{ background: 'transparent', border: 'none', color: '#818cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        {aiWorking === task._id ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        {expandedId === task._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button onClick={() => deleteTask(task._id)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  {expandedId === task._id && (
                    <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: '#020617', borderRadius: '1rem', fontSize: '0.9rem', color: '#94a3b8', border: '1px solid #334155', whiteSpace: 'pre-line' }}>
                      <div className="ai-badge" style={{ marginBottom: '10px', width: 'fit-content' }}>AI STRATEGY</div>
                      {breakdowns[task._id]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default App;