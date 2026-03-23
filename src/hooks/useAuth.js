import { useEffect, useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  const fetchWithAuth = async (url, options = {}) => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      logout();
      throw new Error('No token found');
    }

    const headers = { ...options.headers };
    
    // Add Authorization header
    headers['Authorization'] = `Bearer ${currentToken}`;

    // Add Content-Type if body is present and not FormData
    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
      logout();
      throw new Error('Unauthorized');
    }

    return response;
  };

  return { token, role, logout, fetchWithAuth };
}
