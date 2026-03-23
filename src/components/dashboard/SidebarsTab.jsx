import { useState } from 'react';

export default function SidebarsTab({ sidebars, createSidebar, updateSidebar, deleteSidebar }) {
  const [sidebarForm, setSidebarForm] = useState({ title: '', content: '', links: [] });
  const [isEditingSidebar, setIsEditingSidebar] = useState(false);
  const [editSidebarId, setEditSidebarId] = useState(null);

  const handleSidebarChange = (e) => setSidebarForm({ ...sidebarForm, [e.target.name]: e.target.value });
  
  const addLink = () => setSidebarForm({ ...sidebarForm, links: [...(sidebarForm.links || []), { text: '', url: '' }] });
  
  const updateLink = (index, field, value) => {
    const newLinks = [...(sidebarForm.links || [])];
    newLinks[index][field] = value;
    setSidebarForm({ ...sidebarForm, links: newLinks });
  };
  
  const removeLink = (index) => {
    const newLinks = (sidebarForm.links || []).filter((_, i) => i !== index);
    setSidebarForm({ ...sidebarForm, links: newLinks });
  };

  const handleSidebarSubmit = async (e) => {
    e.preventDefault();
    if (isEditingSidebar) {
      await updateSidebar(editSidebarId, sidebarForm);
    } else {
      await createSidebar(sidebarForm);
    }
    cancelSidebarEdit();
  };

  const editSidebar = (sidebar) => {
    setIsEditingSidebar(true); 
    setEditSidebarId(sidebar.id);
    setSidebarForm({ title: sidebar.title, content: sidebar.content || '', links: sidebar.links || [] });
  };

  const cancelSidebarEdit = () => {
    setIsEditingSidebar(false); 
    setEditSidebarId(null);
    setSidebarForm({ title: '', content: '', links: [] });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this widget?")) {
      deleteSidebar(id);
    }
  };

  return (
    <>
      <div className="form-panel">
        <h3>{isEditingSidebar ? 'Edit Sidebar Widget' : 'Add New Sidebar Widget'}</h3>
        <form onSubmit={handleSidebarSubmit}>
          <div className="form-group">
            <label className="form-label">Widget Title</label>
            <input type="text" name="title" value={sidebarForm.title} onChange={handleSidebarChange} placeholder="e.g. Categories, Useful Links" required />
          </div>
          <div className="form-group">
            <label className="form-label">Widget Content/Description (Optional)</label>
            <textarea name="content" value={sidebarForm.content} onChange={handleSidebarChange} rows="3" placeholder="Brief text to display under title" />
          </div>

          <div className="form-group form-link-group">
            <label className="form-label--bold">Widget Links (Optional)</label>
            {(sidebarForm.links || []).map((link, index) => (
              <div key={index} className="form-link-row">
                <input type="text" placeholder="Link Text" value={link.text} onChange={(e) => updateLink(index, 'text', e.target.value)} required />
                <input type="text" placeholder="URL" value={link.url} onChange={(e) => updateLink(index, 'url', e.target.value)} required />
                <button type="button" onClick={() => removeLink(index)} className="btn btn-danger">X</button>
              </div>
            ))}
            <button type="button" onClick={addLink} className="btn btn-info">+ Add Link</button>
          </div>

          <button type="submit" className={`btn ${isEditingSidebar ? 'btn-success' : 'btn-primary'}`}>
            {isEditingSidebar ? 'Update Widget' : 'Create Widget'}
          </button>
          {isEditingSidebar && <button type="button" onClick={cancelSidebarEdit} className="btn btn-secondary btn-margin-left">Cancel</button>}
        </form>
      </div>

      <h3>Existing Sidebar Widgets</h3>
      <ul className="dashboard-list">
        {Array.isArray(sidebars) && sidebars.length > 0 ? sidebars.map((sidebar, index) => (
          <li key={sidebar.id || index} className="dashboard-list-item">
            <div className="dashboard-list-text">
              {sidebar.title}
              {sidebar.links && sidebar.links.length > 0 && <small>{sidebar.links.length} Links attached</small>}
            </div>
            <div className="dashboard-list-actions">
              <button onClick={() => editSidebar(sidebar)} className="btn btn-edit">Edit</button>
              <button onClick={() => handleDelete(sidebar.id)} className="btn btn-delete">Delete</button>
            </div>
          </li>
        )) : <p>No sidebar widgets found.</p>}
      </ul>
    </>
  );
}
