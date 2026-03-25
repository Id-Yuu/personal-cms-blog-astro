import { useState, useEffect, useRef } from 'react';

function PlaygroundWidget({ content }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !content) return;

    // 1. Parse the HTML string with DOMParser to get clean script textContent
    const parsed = new DOMParser().parseFromString(content, 'text/html');
    const scriptInfos = Array.from(parsed.querySelectorAll('script')).map(s => ({
      text: s.textContent,
      attrs: Array.from(s.attributes).map(a => ({ name: a.name, value: a.value }))
    }));

    // 2. Set innerHTML for styles/markup
    container.innerHTML = content;

    // 3. Remove inert scripts
    Array.from(container.querySelectorAll('script')).forEach(s => s.remove());

    // 4. Re-inject each script as a fresh executable element
    scriptInfos.forEach(({ text, attrs }) => {
      const newScript = document.createElement('script');
      attrs.forEach(({ name, value }) => newScript.setAttribute(name, value));
      newScript.textContent = text;
      container.appendChild(newScript);
    });
  }, [content]);

  return <div ref={containerRef} className="top-widget-playground" />;
}

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
          
          {widget.isPlayground ? (
            <PlaygroundWidget content={widget.content} />
          ) : (
            widget.content && <p className="top-widget-text">{widget.content}</p>
          )}

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
