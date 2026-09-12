import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { resolveSkillLogo, skillInitials } from '../utils/skillLogos';

function SkillLogo({ name, logo }) {
  const [failed, setFailed] = useState(false);
  const src = resolveSkillLogo(name, logo);

  if (!src || failed) {
    return <span className="skill-chip__fallback">{skillInitials(name)}</span>;
  }

  return (
    <img
      className="skill-chip__logo"
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function Skills({ content }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  if (!content) return null;

  return (
    <section className="section" id="skills" ref={ref}>
      <div className="container">
        <motion.p
          className="section__eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          02 — Skills
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
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          {content.subtitle}
        </motion.p>

        <div className="skills__groups">
          {(content.groups || []).map((group, gi) => (
            <motion.div
              className="skill-group"
              key={group.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.12 + gi * 0.1 }}
            >
              <h3 className="skill-group__name">{group.name}</h3>
              <div className="skills__chips">
                {(group.items || []).map((skill, si) => (
                  <motion.div
                    className="skill-chip"
                    key={`${group.name}-${skill.name}-${si}`}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.45, delay: 0.18 + gi * 0.08 + si * 0.04 }}
                    whileHover={{ y: -3 }}
                  >
                    <SkillLogo name={skill.name} logo={skill.logo} />
                    <span className="skill-chip__name">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
