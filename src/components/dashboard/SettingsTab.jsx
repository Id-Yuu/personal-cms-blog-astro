import { useState, useEffect } from 'react';
import { applyThemeToDom } from '../../utils/themeUtils';
import { useAuth } from '../../hooks/useAuth';

export default function SettingsTab({ settingsForm, isSavingSettings, saveSettings }) {
  const [localForm, setLocalForm] = useState(settingsForm);
  const [isUploading, setIsUploading] = useState(false);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    setLocalForm(settingsForm);
    applyThemeToDom(settingsForm);
  }, [settingsForm]);

  const handleSettingsChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const newForm = { ...localForm, [e.target.name]: value };
    setLocalForm(newForm);
    applyThemeToDom(newForm);
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetchWithAuth('http://localhost:4000/upload/setting', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.imageUrl) {
        const newForm = { ...localForm, [fieldName]: data.imageUrl };
        setLocalForm(newForm);
        applyThemeToDom(newForm);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    const success = await saveSettings(localForm);
    if (success) {
      alert('Settings saved successfully!');
    } else {
      alert('Failed to save settings.');
    }
  };

  return (
    <div className="form-panel form-panel--padded">
      <h3>Global Settings</h3>
      <p className="form-note-muted">Configure basic details of your blog. Additional features can be added to this panel in the future.</p>

      <form onSubmit={handleSettingsSubmit} className="form-max-width">
        <div className="form-group">
          <label className="form-label">Blog Name (Header Title)</label>
          <input type="text" name="headerTitle" value={localForm.headerTitle || ''} onChange={handleSettingsChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Blog Description (Header Subtitle)</label>
          <input type="text" name="headerDesc" value={localForm.headerDesc || ''} onChange={handleSettingsChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">
            <input type="checkbox" name="showHeaderTitle" checked={localForm.showHeaderTitle !== false} onChange={handleSettingsChange} />
            Show Header Title & Description
          </label>
          <small className="form-note-small">If disabled, the title and description will be hidden (useful if using a banner image with built-in text).</small>
        </div>

        <hr className="form-actions-sep" />
        
        <h3>Theme Settings</h3>

        <div className="form-group">
          <label className="form-label">Theme Mode</label>
          <select name="themeMode" value={localForm.themeMode || 'light'} onChange={handleSettingsChange} className="select-styled">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Header Background Image URL</label>
          <div className="form-link-row">
            <input type="text" name="headerBgImage" value={localForm.headerBgImage || ''} onChange={handleSettingsChange} placeholder="https://example.com/banner.jpg" />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'headerBgImage')} disabled={isUploading} className="form-file-input" style={{ flex: '0 0 auto' }} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Left Body Background Image</label>
          <div className="form-link-row">
            <input type="text" name="bodyBgImageLeft" value={localForm.bodyBgImageLeft || ''} onChange={handleSettingsChange} placeholder="https://example.com/left-art.png" />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'bodyBgImageLeft')} disabled={isUploading} className="form-file-input" style={{ flex: '0 0 auto' }} />
          </div>
          
          <div className="form-inline-group" style={{ marginTop: '10px' }}>
            <div>
              <label>Position (Left)</label>
              <input type="text" name="bodyBgPositionLeft" value={localForm.bodyBgPositionLeft || ''} onChange={handleSettingsChange} placeholder="left top" />
            </div>
            <div>
              <label>Size (Left %)</label>
              <input type="text" name="bodyBgSizeLeft" value={localForm.bodyBgSizeLeft || ''} onChange={handleSettingsChange} placeholder="20% auto" />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Right Body Background Image</label>
          <div className="form-link-row">
            <input type="text" name="bodyBgImageRight" value={localForm.bodyBgImageRight || ''} onChange={handleSettingsChange} placeholder="https://example.com/right-art.png" />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'bodyBgImageRight')} disabled={isUploading} className="form-file-input" style={{ flex: '0 0 auto' }} />
          </div>
          
          <div className="form-inline-group" style={{ marginTop: '10px' }}>
            <div>
              <label>Position (Right)</label>
              <input type="text" name="bodyBgPositionRight" value={localForm.bodyBgPositionRight || ''} onChange={handleSettingsChange} placeholder="right top" />
            </div>
            <div>
              <label>Size (Right %)</label>
              <input type="text" name="bodyBgSizeRight" value={localForm.bodyBgSizeRight || ''} onChange={handleSettingsChange} placeholder="20% auto" />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <input type="checkbox" name="showBackToTop" checked={localForm.showBackToTop || false} onChange={handleSettingsChange} />
            Show "Back to Top" Toggle
          </label>
        </div>

        <hr className="form-actions-sep" />

        <div className="form-group">
          <label className="form-label">Footer Text / Copyright</label>
          <input type="text" name="footerText" value={localForm.footerText || ''} onChange={handleSettingsChange} required />
        </div>

        <hr className="form-actions-sep" />

        <div className="form-group">
          <label className="form-label">
            Posts Per Page (Load More limit)
          </label>
          <div className="form-inline-group">
            <input
              type="number"
              name="postsPerPage"
              value={localForm.postsPerPage || 3}
              onChange={handleSettingsChange}
              min="1"
              max="50"
              required
              className="input-narrow"
            />
            <span className="form-note-badge">
              Current setting: <strong>{localForm.postsPerPage}</strong> posts
            </span>
          </div>
          <small className="form-note-small">
            Determines how many posts appear on the homepage initially, and how many new posts are fetched when the "Load More" button is clicked.
          </small>
        </div>

        <button type="submit" className="btn btn-success" disabled={isSavingSettings}>
          {isSavingSettings ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
      {/* Here for theme settings */}
    </div>
  );
}
