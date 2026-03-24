export default function Header({ title, desc, showHeaderTitle = true }) {
  return (
    <header className="header">
      {showHeaderTitle !== false && (
        <>
          <h1>{title}</h1>
          <p>{desc}</p>
        </>
      )}
    </header>
  );
}