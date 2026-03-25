export default function Nav({ currentPath, pages = [] }) {
  return (
    <nav className="nav">
      <a href="/" className={currentPath === '/' ? 'active' : ''}>Home</a>
      {pages.map(page => (
        <a
          key={page.id}
          href={`/pages/${page.slug}`}
          className={currentPath === `/pages/${page.slug}` ? 'active' : ''}
        >
          {page.title}
        </a>
      ))}
      <a href="/login" className="nav-dashboard">Dashboard</a>
    </nav>
  );
}