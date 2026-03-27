import { useState } from 'react';
import DefaultEditor from 'react-simple-wysiwyg';

export default function PostsTab({ posts, createPost, updatePost, deletePost }) {
  const [postForm, setPostForm] = useState({ title: '', content: '' });
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [sortOrder, setSortOrder] = useState('recent');

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...postForm, image: existingImage };
    
    if (isEditingPost) {
      await updatePost(editPostId, payload, imageFile);
    } else {
      await createPost(payload, imageFile);
    }
    cancelPostEdit();
  };

  const editPost = (post) => {
    setIsEditingPost(true); 
    setEditPostId(post.id);
    setPostForm({ title: post.title, content: post.content });
    setExistingImage(post.image || ''); 
    setImageFile(null);
  };

  const cancelPostEdit = () => {
    setIsEditingPost(false); 
    setEditPostId(null);
    setPostForm({ title: '', content: '' }); 
    setExistingImage(''); 
    setImageFile(null);
    if (document.getElementById('imageInput')) document.getElementById('imageInput').value = '';
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this post?")) {
      deletePost(id);
    }
  };

  return (
    <>
      <div className="form-panel">
        <h3>{isEditingPost ? 'Edit Post' : 'Add New Post'}</h3>
        <form onSubmit={handlePostSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" name="title" value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <DefaultEditor 
              value={postForm.content || ''} 
              onChange={e => setPostForm({ ...postForm, content: e.target.value })} 
              className="wysiwyg-editor"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Upload Image</label>
            {existingImage && isEditingPost && <img src={existingImage} alt="Current" className="form-image-preview" />}
            <input type="file" id="imageInput" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="form-file-input" />
          </div>
          <button type="submit" className={`btn ${isEditingPost ? 'btn-success' : 'btn-primary'}`}>
            {isEditingPost ? 'Update Post' : 'Publish Post'}
          </button>
          {isEditingPost && <button type="button" onClick={cancelPostEdit} className="btn btn-secondary btn-margin-left">Cancel</button>}
        </form>
      </div>

      <div className="posts-list-header">
        <h3>Existing Posts</h3>
        <div className="sort-toolbar">
          <span className="sort-label">Sort by:</span>
          <button
            className={`sort-btn${sortOrder === 'recent' ? ' sort-btn-active' : ''}`}
            onClick={() => setSortOrder('recent')}
            title="Most recent first"
          >
            🕒 Recent
          </button>
          <button
            className={`sort-btn${sortOrder === 'oldest' ? ' sort-btn-active' : ''}`}
            onClick={() => setSortOrder('oldest')}
            title="Oldest first"
          >
            📅 Oldest
          </button>
          <button
            className={`sort-btn${sortOrder === 'az' ? ' sort-btn-active' : ''}`}
            onClick={() => setSortOrder('az')}
            title="Name A to Z"
          >
            🔤 A → Z
          </button>
          <button
            className={`sort-btn${sortOrder === 'za' ? ' sort-btn-active' : ''}`}
            onClick={() => setSortOrder('za')}
            title="Name Z to A"
          >
            🔤 Z → A
          </button>
        </div>
      </div>
      <ul className="dashboard-list">
        {Array.isArray(posts) && posts.length > 0 ? [...posts]
          .sort((a, b) => {
            if (sortOrder === 'recent') return new Date(b.date || b.id || 0) - new Date(a.date || a.id || 0);
            if (sortOrder === 'oldest') return new Date(a.date || a.id || 0) - new Date(b.date || b.id || 0);
            if (sortOrder === 'az') return (a.title || '').localeCompare(b.title || '');
            if (sortOrder === 'za') return (b.title || '').localeCompare(a.title || '');
            return 0;
          })
          .map(post => (
            <li key={post.id} className="dashboard-list-item">
              <div className="dashboard-list-text">
                <span className="post-title">{post.title}</span>
                {post.date && (
                  <span className="post-date">
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
              <div className="dashboard-list-actions">
                <button onClick={() => editPost(post)} className="btn btn-edit">Edit</button>
                <button onClick={() => handleDelete(post.id)} className="btn btn-delete">Delete</button>
              </div>
            </li>
          )) : <p>No posts found.</p>}
      </ul>
    </>
  );
}
