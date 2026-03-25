import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const API_URL = 'http://localhost:4000';

export function usePages() {
  const [pages, setPages] = useState([]);
  const { fetchWithAuth, token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchPages();
    }
  }, [token]);

  const fetchPages = async () => {
    try {
      const res = await fetch(`${API_URL}/pages`);
      const data = await res.json();
      setPages(Array.isArray(data) ? data : []);
    } catch (error) {
      setPages([]);
    }
  };

  const createPage = async (payload, imageFile) => {
    let finalImageUrl = payload.image || '';

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append('image', imageFile);
      const uploadRes = await fetchWithAuth(`${API_URL}/upload`, { method: 'POST', body: uploadData });
      const uploadResult = await uploadRes.json();
      finalImageUrl = uploadResult.imageUrl;
    }

    const finalPayload = { ...payload, image: finalImageUrl, id: String(Date.now()) };

    const res = await fetchWithAuth(`${API_URL}/pages`, {
      method: 'POST',
      body: JSON.stringify(finalPayload)
    });
    const newPage = await res.json();
    setPages(prev => [...(Array.isArray(prev) ? prev : []), newPage]);
  };

  const updatePage = async (id, payload, imageFile) => {
    let finalImageUrl = payload.image || '';

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append('image', imageFile);
      const uploadRes = await fetchWithAuth(`${API_URL}/upload`, { method: 'POST', body: uploadData });
      const uploadResult = await uploadRes.json();
      finalImageUrl = uploadResult.imageUrl;
    }

    const finalPayload = { ...payload, image: finalImageUrl };

    const res = await fetchWithAuth(`${API_URL}/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(finalPayload)
    });
    const updatedPage = await res.json();
    setPages(prev => (Array.isArray(prev) ? prev : []).map(p => p.id === id ? updatedPage : p));
  };

  const deletePage = async (id) => {
    await fetchWithAuth(`${API_URL}/pages/${id}`, { method: 'DELETE' });
    setPages(prev => (Array.isArray(prev) ? prev : []).filter(p => p.id !== id));
  };

  return { pages, createPage, updatePage, deletePage };
}
