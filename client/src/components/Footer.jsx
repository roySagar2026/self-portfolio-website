export default function Footer({ name }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © {year} <strong>{name || 'Portfolio'}</strong> — Building with purpose.
        </p>
        <p>Software Engineering · Systems · AI · C++</p>
      </div>
    </footer>
  );
}
