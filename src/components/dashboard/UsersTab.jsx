import { useState } from 'react';

export default function UsersTab({ users, createUser, updateUser, deleteUser }) {
  const [userForm, setUserForm] = useState({ username: '', password: '', role: 'author' });
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const handleUserChange = (e) => setUserForm({ ...userForm, [e.target.name]: e.target.value });

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (isEditingUser) {
      const payload = { ...userForm };
      // If the password field is left empty during an edit, don't send it so the backend retains the old hash.
      if (!payload.password) delete payload.password;
      await updateUser(editUserId, payload);
    } else {
      await createUser(userForm);
    }
    cancelUserEdit();
  };

  const editUser = (user) => {
    setIsEditingUser(true); 
    setEditUserId(user.id);
    setUserForm({ username: user.username, password: '', role: user.role || 'author' });
  };

  const cancelUserEdit = () => {
    setIsEditingUser(false); 
    setEditUserId(null);
    setUserForm({ username: '', password: '', role: 'author' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this user?")) {
      deleteUser(id);
    }
  };

  return (
    <>
      <div style={{ background: '#fff', padding: '20px', border: '1px solid #ccc', marginBottom: '30px', borderRadius: '8px' }}>
        <h3>{isEditingUser ? 'Edit User' : 'Add New User'}</h3>
        <form onSubmit={handleUserSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
            <input type="text" name="username" value={userForm.username} onChange={handleUserChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password {isEditingUser && "(Leave blank to keep existing password)"}</label>
            <input type="password" name="password" value={userForm.password} onChange={handleUserChange} required={!isEditingUser} />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Role</label>
            <select name="role" value={userForm.role} onChange={handleUserChange} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="author">Author</option>
            </select>
          </div>

          <button type="submit" className="btn" style={{ backgroundColor: isEditingUser ? '#28a745' : '#007bff' }}>
            {isEditingUser ? 'Update User' : 'Create User'}
          </button>
          {isEditingUser && <button type="button" onClick={cancelUserEdit} className="btn" style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>Cancel</button>}
        </form>
      </div>

      <h3>Existing Users</h3>
      <ul className="dashboard-list">
        {Array.isArray(users) && users.length > 0 ? users.map((user) => (
          <li key={user.id} className="dashboard-list-item">
            <div className="dashboard-list-text">
              {user.username}
              <small>Role: {user.role || 'Unknown'} - {user.username === 'admin' ? '(Superadmin)' : ''}</small>
            </div>
            <div className="dashboard-list-actions">
              <button onClick={() => editUser(user)} className="btn btn-edit">Edit</button>
              {user.username !== 'admin' && ( // Prevent deleting the main admin
                <button onClick={() => handleDelete(user.id)} className="btn btn-delete">Delete</button>
              )}
            </div>
          </li>
        )) : <p>No users found.</p>}
      </ul>
    </>
  );
}
