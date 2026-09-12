import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from './api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import GalaxyBackground from './components/GalaxyBackground';
import Admin from './pages/Admin';
import Login from './pages/Login';

function getRoute() {
  const hash = window.location.hash.replace('#', '') || '/';
  return hash.startsWith('/') ? hash : `/${hash}`;
}

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [content, setContent] = useState(null);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    let alive = true;
    api
      .getContent()
      .then((data) => {
        if (alive) {
          setContent(data);
          document.title = `${data.profile?.name || 'Portfolio'} — Portfolio`;
        }
      })
      .catch((err) => {
        if (alive) setError(err.message);
      });
    return () => {
      alive = false;
    };
  }, [route]);

  useEffect(() => {
    if (route !== '/') return undefined;

    const ids = ['home', 'about', 'skills', 'projects', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [route, content]);

  if (route === '/login') {
    return <Login onSuccess={() => { window.location.hash = '/admin'; }} />;
  }

  if (route === '/admin') {
    return <Admin content={content} onSaved={setContent} />;
  }

  if (error) {
    return (
      <div className="loading-screen">
        <div>
          <p>Could not load portfolio</p>
          <p style={{ marginTop: '0.75rem', color: '#8a8a8a' }}>{error}</p>
          <p style={{ marginTop: '1rem', color: '#6e6e6e' }}>
            Start the API with <code>npm run dev</code>
          </p>
        </div>
      </div>
    );
  }

  if (!content) {
    return <div className="loading-screen">Loading portfolio</div>;
  }

  return (
    <div className="app-shell">
      <GalaxyBackground />

      <Navbar
        name={content.profile?.name}
        activeSection={activeSection}
        resumeAvailable={Boolean(content.profile?.resume?.available)}
      />

      <AnimatePresence mode="wait">
        <motion.main
          key="portfolio"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Hero content={content} />
          <About content={content.about} />
          <Skills content={content.skills} />
          <Projects content={content.projects} />
          <Contact content={content} />
          <Footer name={content.profile?.name} />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
