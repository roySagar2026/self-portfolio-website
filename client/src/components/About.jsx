import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function About({ content }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });

  if (!content) return null;

  return (
    <section className="section" id="about" ref={ref}>
      <div className="container">
        <motion.p
          className="section__eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          01 — About
        </motion.p>
        <motion.h2
          className="section__title"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.05 }}
        >
          {content.title}
        </motion.h2>

        <div className="about__grid">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="about__lead">{content.lead}</p>
            <p className="about__body">{content.body}</p>
            <ul className="about__list">
              {(content.highlights || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="about__panel"
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.18 }}
          >
            <div className="about__stats">
              {(content.stats || []).map((stat, i) => (
                <motion.div
                  className="stat"
                  key={stat.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.25 + i * 0.08 }}
                >
                  <div className="stat__value">{stat.value}</div>
                  <div className="stat__label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
