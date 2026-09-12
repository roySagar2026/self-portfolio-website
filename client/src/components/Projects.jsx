import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function hasLink(url) {
  const v = String(url || '').trim();
  return Boolean(v) && v !== '#' && v.toLowerCase() !== 'none';
}

export default function Projects({ content }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });

  if (!content) return null;

  return (
    <section className="section" id="projects" ref={ref}>
      <div className="container">
        <motion.p
          className="section__eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          03 — Projects
        </motion.p>
        <motion.h2
          className="section__title"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 }}
        >
          {content.title}
        </motion.h2>
        <motion.p
          className="section__subtitle"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.12, duration: 0.6 }}
        >
          {content.subtitle}
        </motion.p>

        <div className="projects__grid">
          {(content.items || []).map((project, i) => {
            const showLive = hasLink(project.liveUrl);
            const showRepo = hasLink(project.repoUrl);
            const showLinks = showLive || showRepo;

            return (
              <motion.article
                className="project-card"
                key={project.id || project.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <div
                  className="project-card__media"
                  style={{ background: project.image || 'linear-gradient(#1a1a1a,#0a0a0a)' }}
                />
                <div className="project-card__body">
                  <div className="project-card__meta">
                    <span>{project.category}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="project-card__title">{project.title}</h3>
                  <p className="project-card__desc">{project.description}</p>
                  <div className="project-card__tags">
                    {(project.tags || []).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  {showLinks && (
                    <div className="project-card__links">
                      {showLive && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer">
                          Live demo
                        </a>
                      )}
                      {showRepo && (
                        <a href={project.repoUrl} target="_blank" rel="noreferrer">
                          Source
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
