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
    <div className="top-widgets">
      {visibleWidgets.map(widget => (
        <div key={widget.id} className="top-widget-item">
          {/* Close / Dismiss Button */}
          <button 
            onClick={() => handleDismiss(widget.id)}
            className="top-widget-dismiss"
            aria-label="Dismiss this notification"
          >
            &times;
          </button>
          
          {widget.title && <h4 className="top-widget-title">{widget.title}</h4>}
          {widget.content && <p className="top-widget-text">{widget.content}</p>}
          {widget.links && widget.links.length > 0 && (
            <div className="top-widget-links">
              {widget.links.map((link, index) => (
                <a key={index} href={link.url} className="btn top-widget-link">
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
