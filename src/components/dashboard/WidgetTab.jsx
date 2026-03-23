import { useState } from 'react';

export default function WidgetTab({ widgets, createWidget, updateWidget, deleteWidget }) {
  const [widgetForm, setWidgetForm] = useState({ title: '', content: '', links: [] });
  const [isEditingWidget, setIsEditingWidget] = useState(false);
  const [editWidgetId, setEditWidgetId] = useState(null);

  const handleWidgetChange = (e) => setWidgetForm({ ...widgetForm, [e.target.name]: e.target.value });
  
  const addLink = () => setWidgetForm({ ...widgetForm, links: [...(widgetForm.links || []), { text: '', url: '' }] });
  
  const updateLink = (index, field, value) => {
    const newLinks = [...(widgetForm.links || [])];
    newLinks[index][field] = value;
    setWidgetForm({ ...widgetForm, links: newLinks });
  };
  
  const removeLink = (index) => {
    const newLinks = (widgetForm.links || []).filter((_, i) => i !== index);
    setWidgetForm({ ...widgetForm, links: newLinks });
  };

  const handleWidgetSubmit = async (e) => {
    e.preventDefault();
    if (isEditingWidget) {
      await updateWidget(editWidgetId, widgetForm);
    } else {
      await createWidget(widgetForm);
    }
    cancelWidgetEdit();
  };

  const editWidget = (widget) => {
    setIsEditingWidget(true); 
    setEditWidgetId(widget.id);
    setWidgetForm({ title: widget.title, content: widget.content || '', links: widget.links || [] });
  };

  const cancelWidgetEdit = () => {
    setIsEditingWidget(false); 
    setEditWidgetId(null);
    setWidgetForm({ title: '', content: '', links: [] });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this top widget?")) {
      deleteWidget(id);
    }
  };

  return (
    <>
      <div style={{ background: '#fff', padding: '20px', border: '1px solid #ccc', marginBottom: '30px', borderRadius: '8px' }}>
        <h3>{isEditingWidget ? 'Edit Top Widget' : 'Add New Top Widget'}</h3>
        <form onSubmit={handleWidgetSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Widget Title</label>
            <input type="text" name="title" value={widgetForm.title} onChange={handleWidgetChange} placeholder="e.g. Announcement, Deals" required />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Widget Content/Description (Optional)</label>
            <textarea name="content" value={widgetForm.content} onChange={handleWidgetChange} rows="3" placeholder="Brief text to display" />
          </div>

          <div className="form-group" style={{ padding: '15px', background: '#f9f9f9', border: '1px dashed #ccc', marginBottom: '15px', borderRadius: '4px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Widget Buttons (Optional)</label>
            {(widgetForm.links || []).map((link, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <input type="text" placeholder="Button Text" value={link.text} onChange={(e) => updateLink(index, 'text', e.target.value)} required style={{ flex: 1 }} />
                <input type="text" placeholder="URL target" value={link.url} onChange={(e) => updateLink(index, 'url', e.target.value)} required style={{ flex: 1 }} />
                <button type="button" onClick={() => removeLink(index)} className="btn" style={{ backgroundColor: '#dc3545', padding: '10px 14px' }}>X</button>
              </div>
            ))}
            <button type="button" onClick={addLink} className="btn" style={{ backgroundColor: '#17a2b8', marginTop: '10px' }}>+ Add Button</button>
          </div>

          <button type="submit" className="btn" style={{ backgroundColor: isEditingWidget ? '#28a745' : '#007bff' }}>
            {isEditingWidget ? 'Update Widget' : 'Create Widget'}
          </button>
          {isEditingWidget && <button type="button" onClick={cancelWidgetEdit} className="btn" style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>Cancel</button>}
        </form>
      </div>

      <h3>Existing Top Widgets</h3>
      <ul className="dashboard-list">
        {Array.isArray(widgets) && widgets.length > 0 ? widgets.map((widget, index) => (
          <li key={widget.id || index} className="dashboard-list-item">
            <div className="dashboard-list-text">
              {widget.title}
              {widget.links && widget.links.length > 0 && <small>{widget.links.length} Buttons attached</small>}
            </div>
            <div className="dashboard-list-actions">
              <button onClick={() => editWidget(widget)} className="btn btn-edit">Edit</button>
              <button onClick={() => handleDelete(widget.id)} className="btn btn-delete">Delete</button>
            </div>
          </li>
        )) : <p>No top widgets found.</p>}
      </ul>
    </>
  );
}
