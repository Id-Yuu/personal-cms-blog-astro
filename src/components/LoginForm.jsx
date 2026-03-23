import { useState, useEffect } from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // If the user is already logged in, redirect them to the dashboard
    if (localStorage.getItem('token')) {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role || 'author'); // Default to author if missing
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <p className="form-error">{error}</p>}
      <div className="form-group">
        <label>Username</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button type="submit" className="btn">Login</button>
    </form>
  );
}