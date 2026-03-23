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
      <div className="form-panel">
        <h3>{isEditingWidget ? 'Edit Top Widget' : 'Add New Top Widget'}</h3>
        <form onSubmit={handleWidgetSubmit}>
          <div className="form-group">
            <label className="form-label">Widget Title</label>
            <input type="text" name="title" value={widgetForm.title} onChange={handleWidgetChange} placeholder="e.g. Announcement, Deals" required />
          </div>
          <div className="form-group">
            <label className="form-label">Widget Content/Description (Optional)</label>
            <textarea name="content" value={widgetForm.content} onChange={handleWidgetChange} rows="3" placeholder="Brief text to display" />
          </div>

          <div className="form-group form-link-group">
            <label className="form-label--bold">Widget Buttons (Optional)</label>
            {(widgetForm.links || []).map((link, index) => (
              <div key={index} className="form-link-row">
                <input type="text" placeholder="Button Text" value={link.text} onChange={(e) => updateLink(index, 'text', e.target.value)} required />
                <input type="text" placeholder="URL target" value={link.url} onChange={(e) => updateLink(index, 'url', e.target.value)} required />
                <button type="button" onClick={() => removeLink(index)} className="btn btn-danger">X</button>
              </div>
            ))}
            <button type="button" onClick={addLink} className="btn btn-info">+ Add Button</button>
          </div>

          <button type="submit" className={`btn ${isEditingWidget ? 'btn-success' : 'btn-primary'}`}>
            {isEditingWidget ? 'Update Widget' : 'Create Widget'}
          </button>
          {isEditingWidget && <button type="button" onClick={cancelWidgetEdit} className="btn btn-secondary btn-margin-left">Cancel</button>}
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
