import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const API_URL = 'http://localhost:4000';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const { fetchWithAuth, token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await fetchWithAuth(`${API_URL}/users`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) { setUsers([]); }
  };

  const createUser = async (payload) => {
    const finalPayload = { ...payload, id: String(Date.now()) };
    const res = await fetchWithAuth(`${API_URL}/users`, {
      method: 'POST', body: JSON.stringify(finalPayload)
    });
    const newUser = await res.json();
    setUsers(prev => [...(Array.isArray(prev) ? prev : []), newUser]);
  };

  const updateUser = async (id, payload) => {
    const res = await fetchWithAuth(`${API_URL}/users/${id}`, {
      method: 'PATCH', body: JSON.stringify(payload)
    });
    const updatedUser = await res.json();
    setUsers(prev => (Array.isArray(prev) ? prev : []).map(u => u.id === id ? updatedUser : u));
  };

  const deleteUser = async (id) => {
    await fetchWithAuth(`${API_URL}/users/${id}`, { method: 'DELETE' });
    setUsers(prev => (Array.isArray(prev) ? prev : []).filter(u => u.id !== id));
  };

  return { users, createUser, updateUser, deleteUser };
}
