import { useState, useEffect } from 'react';

export default function SettingsTab({ settingsForm, isSavingSettings, saveSettings }) {
  const [localForm, setLocalForm] = useState(settingsForm);

  useEffect(() => {
    setLocalForm(settingsForm);
  }, [settingsForm]);

  const handleSettingsChange = (e) => {
    setLocalForm({ ...localForm, [e.target.name]: e.target.value });
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
    </div>
  );
}
