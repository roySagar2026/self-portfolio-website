import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaGithub, FaLinkedin, FaXTwitter, FaDribbble } from 'react-icons/fa6';
import { api } from '../api';

export default function Contact({ content }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  const profile = content?.profile || {};
  const contact = content?.contact || {};

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: '', text: '' });
    try {
      await api.sendContact(form);
      setStatus({
        type: 'ok',
        text: contact.successMessage || 'Message sent successfully.',
      });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'err', text: err.message || 'Failed to send message.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section" id="contact" ref={ref}>
      <div className="container">
        <motion.p
          className="section__eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          04 — Contact
        </motion.p>
        <motion.h2
          className="section__title"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 }}
        >
          {contact.title || 'Contact'}
        </motion.h2>
        <motion.p
          className="section__subtitle"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.12, duration: 0.6 }}
        >
          {contact.subtitle}
        </motion.p>

        <div className="contact__grid">
          <motion.aside
            className="contact__info"
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h3>Let&apos;s talk</h3>
            <div className="contact__row">
              <span>Email</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </div>
            <div className="contact__row">
              <span>Phone</span>
              <p>{profile.phone}</p>
            </div>
            <div className="contact__row">
              <span>Location</span>
              <p>{profile.location}</p>
            </div>
            <div className="contact__socials">
              {profile.socials?.github && (
                <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <FaGithub />
                </a>
              )}
              {profile.socials?.linkedin && (
                <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
              )}
              {profile.socials?.twitter && (
                <a href={profile.socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
                  <FaXTwitter />
                </a>
              )}
              {profile.socials?.dribbble && (
                <a href={profile.socials.dribbble} target="_blank" rel="noreferrer" aria-label="Dribbble">
                  <FaDribbble />
                </a>
              )}
            </div>
          </motion.aside>

          <motion.form
            className="contact__form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.16 }}
          >
            <div className="form-row">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  placeholder="you@email.com"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                value={form.subject}
                onChange={onChange}
                placeholder="Project inquiry"
              />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={onChange}
                required
                placeholder="Tell me about your project..."
              />
            </div>

            {status.text && (
              <div className={`form-status form-status--${status.type}`}>{status.text}</div>
            )}

            <button className="btn btn--solid" type="submit" disabled={sending}>
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
