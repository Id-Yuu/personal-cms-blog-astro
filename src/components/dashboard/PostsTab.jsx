import { useState } from 'react';
import DefaultEditor from 'react-simple-wysiwyg';

export default function PostsTab({ posts, createPost, updatePost, deletePost }) {
  const [postForm, setPostForm] = useState({ title: '', content: '' });
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostId, setEditPostId] = useState(null);

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
      <div style={{ background: '#fff', padding: '20px', border: '1px solid #ccc', marginBottom: '30px', borderRadius: '8px' }}>
        <h3>{isEditingPost ? 'Edit Post' : 'Add New Post'}</h3>
        <form onSubmit={handlePostSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Title</label>
            <input type="text" name="title" value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} required />
          </div>
          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Content</label>
            <DefaultEditor 
              value={postForm.content || ''} 
              onChange={e => setPostForm({ ...postForm, content: e.target.value })} 
              style={{ background: '#fff', minHeight: '200px' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Upload Image</label>
            {existingImage && isEditingPost && <img src={existingImage} alt="Current" style={{ width: '100px', display: 'block', marginBottom: '10px' }} />}
            <input type="file" id="imageInput" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ padding: '0', border: 'none' }} />
          </div>
          <button type="submit" className="btn" style={{ backgroundColor: isEditingPost ? '#28a745' : '#007bff' }}>
            {isEditingPost ? 'Update Post' : 'Publish Post'}
          </button>
          {isEditingPost && <button type="button" onClick={cancelPostEdit} className="btn" style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>Cancel</button>}
        </form>
      </div>

      <h3>Existing Posts</h3>
      <ul className="dashboard-list">
        {Array.isArray(posts) && posts.length > 0 ? posts.map(post => (
          <li key={post.id} className="dashboard-list-item">
            <div className="dashboard-list-text">{post.title}</div>
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
