import React, { useState } from 'react';
import { login, register } from '../services/api';

const Auth = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'user' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        //
        const { data } = await login({ email: formData.email, password: formData.password });
        localStorage.setItem('token', data.token); 
        setToken(data.token);
      } else {
        //
        await register(formData);
        alert("Registration Successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" required 
          onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" required 
          onChange={(e) => setFormData({...formData, password: e.target.value})} />
        {!isLogin && (
          <select onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        )}
        <button type="submit">{isLogin ? 'Sign In' : 'Sign Up'}</button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)} style={{cursor:'pointer', marginTop: '10px'}}>
        {isLogin ? "Need an account? Register" : "Already have an account? Login"}
      </p>
    </div>
  );
};

export default Auth;