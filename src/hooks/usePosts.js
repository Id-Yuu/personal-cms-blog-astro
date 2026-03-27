import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const API_URL = 'http://localhost:4000';

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const { fetchWithAuth, token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      setPosts([]);
    }
  };

  const createPost = async (payload, imageFile) => {
    let finalImageUrl = payload.image || '';

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append('image', imageFile);
      const uploadRes = await fetchWithAuth(`${API_URL}/upload`, { method: 'POST', body: uploadData });
      const uploadResult = await uploadRes.json();
      finalImageUrl = uploadResult.imageUrl;
    }

    // Extract userId and role from token: "mock-jwt-token-{userId}-{role}-{timestamp}"
    const storedToken = localStorage.getItem('token') || '';
    const tokenParts = storedToken.replace('mock-jwt-token-', '').split('-');
    const postedBy = tokenParts[0] || '';
    const postedByRole = tokenParts[1] || '';

    const finalPayload = {
      ...payload,
      image: finalImageUrl,
      id: String(Date.now()),
      date: new Date().toISOString(),
      postedBy,
      postedByRole,
    };

    const res = await fetchWithAuth(`${API_URL}/posts`, {
      method: 'POST',
      body: JSON.stringify(finalPayload)
    });
    const newPost = await res.json();
    setPosts(prev => [...(Array.isArray(prev) ? prev : []), newPost]);
  };

  const updatePost = async (id, payload, imageFile) => {
    let finalImageUrl = payload.image || '';

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append('image', imageFile);
      const uploadRes = await fetchWithAuth(`${API_URL}/upload`, { method: 'POST', body: uploadData });
      const uploadResult = await uploadRes.json();
      finalImageUrl = uploadResult.imageUrl;
    }

    const finalPayload = { ...payload, image: finalImageUrl };

    const res = await fetchWithAuth(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(finalPayload)
    });
    const updatedPost = await res.json();
    setPosts(prev => (Array.isArray(prev) ? prev : []).map(p => p.id === id ? updatedPost : p));
  };

  const deletePost = async (id) => {
    await fetchWithAuth(`${API_URL}/posts/${id}`, { method: 'DELETE' });
    setPosts(prev => (Array.isArray(prev) ? prev : []).filter(p => p.id !== id));
  };

  return { posts, createPost, updatePost, deletePost };
}
