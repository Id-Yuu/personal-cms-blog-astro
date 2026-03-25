import { useState } from 'react';
import DefaultEditor from 'react-simple-wysiwyg';

export default function PagesTab({ pages, createPage, updatePage, deletePage }) {
  const [pageForm, setPageForm] = useState({ title: '', slug: '', content: '' });
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [editPageId, setEditPageId] = useState(null);

  const handlePageSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...pageForm, image: existingImage };

    if (isEditingPage) {
      await updatePage(editPageId, payload, imageFile);
    } else {
      await createPage(payload, imageFile);
    }
    cancelPageEdit();
  };

  const editPage = (page) => {
    setIsEditingPage(true);
    setEditPageId(page.id);
    setPageForm({ title: page.title, slug: page.slug || '', content: page.content || '' });
    setExistingImage(page.image || '');
    setImageFile(null);
  };

  const cancelPageEdit = () => {
    setIsEditingPage(false);
    setEditPageId(null);
    setPageForm({ title: '', slug: '', content: '' });
    setExistingImage('');
    setImageFile(null);
    if (document.getElementById('pageImageInput')) document.getElementById('pageImageInput').value = '';
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this page?')) {
      deletePage(id);
    }
  };

  // Auto-generate slug from title when creating a new page
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const updates = { ...pageForm, title };
    if (!isEditingPage) {
      updates.slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    setPageForm(updates);
  };

  return (
    <>
      <div className="form-panel">
        <h3>{isEditingPage ? 'Edit Page' : 'Add New Page'}</h3>
        <form onSubmit={handlePageSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={pageForm.title}
              onChange={handleTitleChange}
              placeholder="e.g. About Us"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Slug (URL path)</label>
            <input
              type="text"
              name="slug"
              value={pageForm.slug}
              onChange={e => setPageForm({ ...pageForm, slug: e.target.value })}
              placeholder="e.g. about-us"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <DefaultEditor
              value={pageForm.content || ''}
              onChange={e => setPageForm({ ...pageForm, content: e.target.value })}
              className="wysiwyg-editor"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Upload Image (Optional)</label>
            {existingImage && isEditingPage && (
              <img src={existingImage} alt="Current" className="form-image-preview" />
            )}
            <input
              type="file"
              id="pageImageInput"
              accept="image/*"
              onChange={e => setImageFile(e.target.files[0])}
              className="form-file-input"
            />
          </div>
          <button type="submit" className={`btn ${isEditingPage ? 'btn-success' : 'btn-primary'}`}>
            {isEditingPage ? 'Update Page' : 'Publish Page'}
          </button>
          {isEditingPage && (
            <button type="button" onClick={cancelPageEdit} className="btn btn-secondary btn-margin-left">
              Cancel
            </button>
          )}
        </form>
      </div>

      <h3>Existing Pages</h3>
      <ul className="dashboard-list">
        {Array.isArray(pages) && pages.length > 0 ? pages.map(page => (
          <li key={page.id} className="dashboard-list-item">
            <div className="dashboard-list-text">
              {page.title}
              {page.slug && <small><a href={`/pages/${page.slug}`} target="_blank" rel="noreferrer">/{page.slug}</a></small>}
            </div>
            <div className="dashboard-list-actions">
              <button onClick={() => editPage(page)} className="btn btn-edit">Edit</button>
              <button onClick={() => handleDelete(page.id)} className="btn btn-delete">Delete</button>
            </div>
          </li>
        )) : <p>No pages found.</p>}
      </ul>
    </>
  );
}
