import { useEffect, useState } from 'react';
import { apiUrl } from '../config';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ name, activeSection, resumeAvailable }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const downloadResume = async () => {
    setOpen(false);
    if (!resumeAvailable) {
      window.alert('Resume is not available yet. Please check back soon.');
      return;
    }

    setDownloading(true);
    try {
      const res = await fetch(apiUrl('/api/resume'));
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not download resume');
      }

      const blob = await res.blob();
      const disposition = res.headers.get('Content-Disposition') || '';
      const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
      const fileName = match?.[1]
        ? decodeURIComponent(match[1])
        : `${(name || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      window.alert(err.message || 'Resume download failed');
    } finally {
      setDownloading(false);
    }
  };

  const brand = name?.split(' ')[0] || 'Portfolio';

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <a
          href="#home"
          className="nav__brand"
          onClick={(e) => {
            e.preventDefault();
            go('home');
          }}
        >
          {brand}
          <span> / systems</span>
        </a>

        <button
          className="nav__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav__links ${open ? 'is-open' : ''}`} aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`nav__link ${activeSection === link.id ? 'is-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                go(link.id);
              }}
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            className="nav__link nav__resume"
            onClick={downloadResume}
            disabled={downloading}
          >
            {downloading ? 'Downloading…' : 'Resume'}
          </button>
        </nav>
      </div>
    </header>
  );
}
