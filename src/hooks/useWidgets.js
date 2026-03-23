import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const API_URL = 'http://localhost:4000';

export function useWidgets() {
  const [widgets, setWidgets] = useState([]);
  const { fetchWithAuth, token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchWidgets();
    }
  }, [token]);

  const fetchWidgets = async () => {
    try {
      const res = await fetch(`${API_URL}/widgets`);
      const data = await res.json();
      setWidgets(Array.isArray(data) ? data : []);
    } catch (error) { setWidgets([]); }
  };

  const createWidget = async (payload) => {
    const finalPayload = { ...payload, id: String(Date.now()) };
    const res = await fetchWithAuth(`${API_URL}/widgets`, {
      method: 'POST', body: JSON.stringify(finalPayload)
    });
    const newWidget = await res.json();
    setWidgets(prev => [...(Array.isArray(prev) ? prev : []), newWidget]);
  };

  const updateWidget = async (id, payload) => {
    const res = await fetchWithAuth(`${API_URL}/widgets/${id}`, {
      method: 'PUT', body: JSON.stringify(payload)
    });
    const updatedWidget = await res.json();
    setWidgets(prev => (Array.isArray(prev) ? prev : []).map(w => w.id === id ? updatedWidget : w));
  };

  const deleteWidget = async (id) => {
    await fetchWithAuth(`${API_URL}/widgets/${id}`, { method: 'DELETE' });
    setWidgets(prev => (Array.isArray(prev) ? prev : []).filter(w => w.id !== id));
  };

  return { widgets, createWidget, updateWidget, deleteWidget };
}
