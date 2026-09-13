import { motion } from 'framer-motion';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { y: 48, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero({ content }) {
  const { hero, profile } = content;
  const lines = (hero?.headline || 'Portfolio').split(' ');

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="home">
      <div className="hero__frame" aria-hidden>
        <div className="hero__scan" />
      </div>

      <div className="container hero__content">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p className="hero__eyebrow" variants={item}>
            <i />
            {hero?.eyebrow || 'Portfolio'}
          </motion.p>

          <motion.h1 className="hero__title" variants={item}>
            {lines.map((word) => (
              <span className="line" key={word}>
                {word}
              </span>
            ))}
          </motion.h1>

          <motion.p className="hero__sub" variants={item}>
            {hero?.subheadline || profile?.tagline}
          </motion.p>

          <motion.div className="hero__actions" variants={item}>
            <button className="btn btn--solid" onClick={() => scrollTo('projects')}>
              {hero?.ctaPrimary || 'View Projects'}
            </button>
            <button className="btn btn--ghost" onClick={() => scrollTo('contact')}>
              {hero?.ctaSecondary || 'Contact Me'}
            </button>
          </motion.div>

          <motion.div className="hero__meta" variants={item}>
            <div>
              Role
              <strong>{profile?.role}</strong>
            </div>
            <div>
              Location
              <strong>{profile?.location}</strong>
            </div>
            <div>
              Status
              <strong>{profile?.availability}</strong>
            </div>
          </motion.div>
        </motion.div>
      </div>    
    </section>
  );
}
