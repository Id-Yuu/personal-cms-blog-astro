export default function Header({ title, desc }) {
  return (
    <header className="header">
      <h1>{title}</h1>
      <p>{desc}</p>
    </header>
  );
}