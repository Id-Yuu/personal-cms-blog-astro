export default function Nav({ currentPath }) {
  return (
    <nav className="nav">
      <a href="/" className={currentPath === '/' ? 'active' : ''}>Home</a>
      <a href="/about" className={currentPath === '/about' ? 'active' : ''}>About</a>
      <a href="/contact" className={currentPath === '/contact' ? 'active' : ''}>Contact</a>
      <a href="/login" className="nav-dashboard">Dashboard</a>
    </nav>
  );
}