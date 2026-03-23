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
    <div style={{ background: '#fff', padding: '25px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '30px' }}>
      <h3>Global Settings</h3>
      <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.95rem' }}>Configure basic details of your blog. Additional features can be added to this panel in the future.</p>

      <form onSubmit={handleSettingsSubmit} style={{ maxWidth: '600px' }}>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Blog Name (Header Title)</label>
          <input type="text" name="headerTitle" value={localForm.headerTitle || ''} onChange={handleSettingsChange} required />
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Blog Description (Header Subtitle)</label>
          <input type="text" name="headerDesc" value={localForm.headerDesc || ''} onChange={handleSettingsChange} required />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '25px 0' }} />

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Footer Text / Copyright</label>
          <input type="text" name="footerText" value={localForm.footerText || ''} onChange={handleSettingsChange} required />
        </div>

        <hr style={{ margin: '25px 0' }} />

        <div className="form-group" style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Posts Per Page (Load More limit)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input
              type="number"
              name="postsPerPage"
              value={localForm.postsPerPage || 3}
              onChange={handleSettingsChange}
              min="1"
              max="50"
              required
              style={{ width: '120px' }}
            />
            <span style={{ fontSize: '0.9rem', color: '#555', backgroundColor: '#f4f4f4', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd' }}>
              Current setting: <strong>{localForm.postsPerPage}</strong> posts
            </span>
          </div>
          <small style={{ display: 'block', marginTop: '8px', color: '#666', fontSize: '0.85rem' }}>
            Determines how many posts appear on the homepage initially, and how many new posts are fetched when the "Load More" button is clicked.
          </small>
        </div>

        <button type="submit" className="btn" style={{ backgroundColor: '#28a745', color: '#fff', marginTop: '10px' }} disabled={isSavingSettings}>
          {isSavingSettings ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
