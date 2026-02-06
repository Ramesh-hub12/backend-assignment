import React, { useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  // Initialize state with the token from localStorage if it exists
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Function to handle logout and clear local storage
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Anything AI Task Manager</h1>
        {token && (
          <button onClick={logout} style={{ height: '30px', cursor: 'pointer' }}>
            Logout
          </button>
        )}
      </header>

      <main>
        {!token ? (         
          <Auth setToken={setToken} />
        ) : (
          <Dashboard />
        )}
      </main>
    </div>
  );
}

export default App;