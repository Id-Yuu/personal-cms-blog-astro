import { useEffect, useState, useRef } from 'react';

function PlaygroundWidget({ content }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !content) return;

    // 1. Parse the HTML string with DOMParser to get clean script textContent
    //    (innerHTML can mangle < chars inside scripts when reading back)
    const parsed = new DOMParser().parseFromString(content, 'text/html');
    const scriptInfos = Array.from(parsed.querySelectorAll('script')).map(s => ({
      text: s.textContent,
      attrs: Array.from(s.attributes).map(a => ({ name: a.name, value: a.value }))
    }));

    // 2. Set innerHTML for styles/markup (scripts inserted here won't execute)
    container.innerHTML = content;

    // 3. Remove the inert scripts injected by innerHTML
    Array.from(container.querySelectorAll('script')).forEach(s => s.remove());

    // 4. Re-inject each script as a fresh element so the browser executes it
    scriptInfos.forEach(({ text, attrs }) => {
      const newScript = document.createElement('script');
      attrs.forEach(({ name, value }) => newScript.setAttribute(name, value));
      newScript.textContent = text;
      container.appendChild(newScript);
    });
  }, [content]);

  return <div ref={containerRef} className="widget-playground" />;
}

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
          
          {widget.isPlayground ? (
            <PlaygroundWidget content={widget.content} />
          ) : (
            widget.content && <p className="widget-content">{widget.content}</p>
          )}

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