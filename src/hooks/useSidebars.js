import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const API_URL = 'http://localhost:4000';

export function useSidebars() {
  const [sidebars, setSidebars] = useState([]);
  const { fetchWithAuth, token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchSidebars();
    }
  }, [token]);

  const fetchSidebars = async () => {
    try {
      const res = await fetch(`${API_URL}/sidebars`);
      const data = await res.json();
      setSidebars(Array.isArray(data) ? data : []);
    } catch (error) { setSidebars([]); }
  };

  const createSidebar = async (payload) => {
    const finalPayload = { ...payload, id: String(Date.now()) };
    const res = await fetchWithAuth(`${API_URL}/sidebars`, {
      method: 'POST', body: JSON.stringify(finalPayload)
    });
    const newSidebar = await res.json();
    setSidebars(prev => [...(Array.isArray(prev) ? prev : []), newSidebar]);
  };

  const updateSidebar = async (id, payload) => {
    const res = await fetchWithAuth(`${API_URL}/sidebars/${id}`, {
      method: 'PUT', body: JSON.stringify(payload)
    });
    const updatedSidebar = await res.json();
    setSidebars(prev => (Array.isArray(prev) ? prev : []).map(s => s.id === id ? updatedSidebar : s));
  };

  const deleteSidebar = async (id) => {
    await fetchWithAuth(`${API_URL}/sidebars/${id}`, { method: 'DELETE' });
    setSidebars(prev => (Array.isArray(prev) ? prev : []).filter(s => s.id !== id));
  };

  return { sidebars, createSidebar, updateSidebar, deleteSidebar };
}
