import { useState, useEffect } from 'react';

export default function TopWidget() {
  const [widgets, setWidgets] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    // Load previously dismissed widgets from localStorage so they remain hidden for the user
    const savedDismissed = localStorage.getItem('dismissedTopWidgets');
    if (savedDismissed) {
      try {
        setDismissed(JSON.parse(savedDismissed));
      } catch (e) {
        setDismissed([]);
      }
    }

    fetch('http://localhost:4000/widgets')
      .then(res => res.json())
      .then(data => setWidgets(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to load top widgets", err));
  }, []);

  const handleDismiss = (id) => {
    const updatedDismissed = [...dismissed, id];
    setDismissed(updatedDismissed);
    localStorage.setItem('dismissedTopWidgets', JSON.stringify(updatedDismissed));
  };

  const visibleWidgets = widgets.filter(w => !dismissed.includes(w.id));

  if (visibleWidgets.length === 0) return null;

  return (
    <div className="top-widgets" style={{ marginBottom: '25px' }}>
      {visibleWidgets.map(widget => (
        <div key={widget.id} style={{ 
          background: '#f8f9fa', 
          borderLeft: '4px solid #0066cc', 
          padding: '15px 20px', 
          marginBottom: '15px',
          borderRadius: '4px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          position: 'relative'
        }}>
          {/* Close / Dismiss Button */}
          <button 
            onClick={() => handleDismiss(widget.id)}
            style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '15px', 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '1.2rem', 
              color: '#888',
              padding: 0,
              lineHeight: 1
            }}
            aria-label="Dismiss this notification"
          >
            &times;
          </button>
          
          {widget.title && <h4 style={{ margin: '0 0 8px 0', fontSize: '1.15rem', color: '#111', paddingRight: '20px' }}>{widget.title}</h4>}
          {widget.content && <p style={{ margin: '0 0 12px 0', color: '#444' }}>{widget.content}</p>}
          {widget.links && widget.links.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {widget.links.map((link, index) => (
                <a key={index} href={link.url} className="btn" style={{ padding: '6px 14px', fontSize: '0.9rem', backgroundColor: '#0066cc', color: '#fff' }}>
                  {link.text}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
