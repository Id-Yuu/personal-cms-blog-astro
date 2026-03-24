import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/sidebars')
      .then(res => res.json())
      .then(data => setWidgets(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching sidebars:", err));
  }, []);

  // if (widgets.length === 0) return null; // Hide if no sidebars exist

  return (
    <aside className="main-side">
      {widgets.map(widget => (
        <div className="widget" key={widget.id}>
          <h4>{widget.title}</h4>
          {widget.content && <p className="widget-content">{widget.content}</p>}

          {/* Render Link Lists if they exist */}
          {widget.links && widget.links.length > 0 && (
            <ul>
              {widget.links.map((link, index) => (
                <li key={index}>
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
}