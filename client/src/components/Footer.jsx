export default function Footer({ name }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © {year} <strong>{name || 'Portfolio'}</strong> — crafted in monochrome.
        </p>
        <p>Dark theme · Smooth scroll · Live CMS</p>
      </div>
    </footer>
  );
}
