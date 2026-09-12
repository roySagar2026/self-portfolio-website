import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { apiUrl } from '../config';

const TABS = ['Profile', 'Hero', 'About', 'Skills', 'Projects', 'Contact', 'Resume', 'Messages'];

function Field({ label, value, onChange, multiline, type = 'text' }) {
  return (
    <div className="field">
      <label>{label}</label>
      {multiline ? (
        <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={5} />
      ) : (
        <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export default function Admin({ content: initialContent, onSaved }) {
  const [authed, setAuthed] = useState(null);
  const [tab, setTab] = useState('Profile');
  const [draft, setDraft] = useState(null);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('portfolio_token');
    if (!token) {
      window.location.hash = '/login';
      return;
    }
    api
      .me()
      .then((user) => setAuthed(user))
      .catch(() => {
        localStorage.removeItem('portfolio_token');
        window.location.hash = '/login';
      });
  }, []);

  useEffect(() => {
    if (initialContent) setDraft(structuredClone(initialContent));
  }, [initialContent]);

  useEffect(() => {
    if (tab !== 'Messages' || !authed) return;
    api
      .getMessages()
      .then(setMessages)
      .catch((err) => setError(err.message));
  }, [tab, authed]);

  const unread = useMemo(
    () => messages.filter((m) => !m.read).length,
    [messages]
  );

  if (!authed || !draft) {
    return <div className="loading-screen">Loading admin</div>;
  }

  const setPath = (path, value) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i += 1) {
        if (cur[keys[i]] == null) cur[keys[i]] = {};
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setStatus('');
    setError('');
    try {
      const res = await api.saveContent(draft);
      onSaved?.(res.content);
      setStatus('Portfolio content saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('portfolio_token');
    window.location.hash = '/';
  };

  const updateSkill = (gi, ii, key, value) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      next.skills.groups[gi].items[ii][key] = value;
      return next;
    });
  };

  const addSkill = (gi) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      next.skills.groups[gi].items.push({ name: 'New Skill' });
      return next;
    });
  };

  const removeSkill = (gi, ii) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      next.skills.groups[gi].items.splice(ii, 1);
      return next;
    });
  };

  const addSkillGroup = () => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      if (!next.skills.groups) next.skills.groups = [];
      next.skills.groups.push({ name: 'New Group', items: [{ name: 'React' }] });
      return next;
    });
  };

  const removeSkillGroup = (gi) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      next.skills.groups.splice(gi, 1);
      return next;
    });
  };

  const updateProject = (pi, key, value) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      next.projects.items[pi][key] =
        key === 'tags' ? value.split(',').map((t) => t.trim()).filter(Boolean) : value;
      return next;
    });
  };

  const addProject = () => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      next.projects.items.push({
        id: `p${Date.now()}`,
        title: 'New Project',
        category: 'Category',
        year: String(new Date().getFullYear()),
        description: 'Describe the project…',
        tags: ['React'],
        image: 'linear-gradient(135deg, #1a1a1a, #0d0d0d)',
        liveUrl: '',
        repoUrl: '',
        featured: false,
      });
      return next;
    });
  };

  const removeProject = (pi) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      next.projects.items.splice(pi, 1);
      return next;
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-card">
        <h1>Portfolio Admin</h1>
        <p>
          Signed in as {authed.email}. Session lasts <strong>30 minutes</strong>. Edit any section,
          then save. (Admin is hidden from the public nav — open <code>#/admin</code> manually.)
        </p>

        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              className={tab === t ? 'is-active' : ''}
              onClick={() => setTab(t)}
            >
              {t}
              {t === 'Messages' && unread ? ` (${unread})` : ''}
            </button>
          ))}
        </div>

        {tab === 'Profile' && (
          <div className="admin-grid">
            <Field label="Name" value={draft.profile.name} onChange={(v) => setPath('profile.name', v)} />
            <Field label="Role" value={draft.profile.role} onChange={(v) => setPath('profile.role', v)} />
            <Field
              label="Tagline"
              value={draft.profile.tagline}
              onChange={(v) => setPath('profile.tagline', v)}
            />
            <Field
              label="Location"
              value={draft.profile.location}
              onChange={(v) => setPath('profile.location', v)}
            />
            <Field
              label="Availability"
              value={draft.profile.availability}
              onChange={(v) => setPath('profile.availability', v)}
            />
            <Field label="Email" value={draft.profile.email} onChange={(v) => setPath('profile.email', v)} />
            <Field label="Phone" value={draft.profile.phone} onChange={(v) => setPath('profile.phone', v)} />
            <Field
              label="GitHub"
              value={draft.profile.socials?.github}
              onChange={(v) => setPath('profile.socials.github', v)}
            />
            <Field
              label="LinkedIn"
              value={draft.profile.socials?.linkedin}
              onChange={(v) => setPath('profile.socials.linkedin', v)}
            />
            <Field
              label="Twitter / X"
              value={draft.profile.socials?.twitter}
              onChange={(v) => setPath('profile.socials.twitter', v)}
            />
            <Field
              label="Dribbble"
              value={draft.profile.socials?.dribbble}
              onChange={(v) => setPath('profile.socials.dribbble', v)}
            />
          </div>
        )}

        {tab === 'Hero' && (
          <div className="admin-grid">
            <Field label="Eyebrow" value={draft.hero.eyebrow} onChange={(v) => setPath('hero.eyebrow', v)} />
            <Field
              label="Headline"
              value={draft.hero.headline}
              onChange={(v) => setPath('hero.headline', v)}
            />
            <Field
              label="Subheadline"
              value={draft.hero.subheadline}
              onChange={(v) => setPath('hero.subheadline', v)}
              multiline
            />
            <Field
              label="Primary CTA"
              value={draft.hero.ctaPrimary}
              onChange={(v) => setPath('hero.ctaPrimary', v)}
            />
            <Field
              label="Secondary CTA"
              value={draft.hero.ctaSecondary}
              onChange={(v) => setPath('hero.ctaSecondary', v)}
            />
          </div>
        )}

        {tab === 'About' && (
          <div className="admin-grid">
            <Field label="Title" value={draft.about.title} onChange={(v) => setPath('about.title', v)} />
            <Field label="Lead" value={draft.about.lead} onChange={(v) => setPath('about.lead', v)} multiline />
            <Field label="Body" value={draft.about.body} onChange={(v) => setPath('about.body', v)} multiline />
            <Field
              label="Highlights (one per line)"
              value={(draft.about.highlights || []).join('\n')}
              onChange={(v) =>
                setPath(
                  'about.highlights',
                  v.split('\n').map((s) => s.trim()).filter(Boolean)
                )
              }
              multiline
            />
            {(draft.about.stats || []).map((stat, i) => (
              <div className="form-row" key={stat.label + i}>
                <Field
                  label={`Stat ${i + 1} label`}
                  value={stat.label}
                  onChange={(v) => {
                    setDraft((prev) => {
                      const next = structuredClone(prev);
                      next.about.stats[i].label = v;
                      return next;
                    });
                  }}
                />
                <Field
                  label={`Stat ${i + 1} value`}
                  value={stat.value}
                  onChange={(v) => {
                    setDraft((prev) => {
                      const next = structuredClone(prev);
                      next.about.stats[i].value = v;
                      return next;
                    });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {tab === 'Skills' && (
          <div className="admin-grid">
            <Field label="Title" value={draft.skills.title} onChange={(v) => setPath('skills.title', v)} />
            <Field
              label="Subtitle"
              value={draft.skills.subtitle}
              onChange={(v) => setPath('skills.subtitle', v)}
            />
            <p className="muted" style={{ fontSize: '0.85rem' }}>
              Type a skill name (e.g. React, Docker, Figma) — logos are fetched automatically from public
              icon CDNs. Optional custom logo URL overrides auto-fetch.
            </p>
            {(draft.skills.groups || []).map((group, gi) => (
              <div key={`${group.name}-${gi}`} style={{ borderTop: '1px solid #2c2c2c', paddingTop: '1rem' }}>
                <Field
                  label="Group name"
                  value={group.name}
                  onChange={(v) => {
                    setDraft((prev) => {
                      const next = structuredClone(prev);
                      next.skills.groups[gi].name = v;
                      return next;
                    });
                  }}
                />
                {(group.items || []).map((skill, ii) => (
                  <div
                    key={`${gi}-${ii}`}
                    style={{
                      display: 'grid',
                      gap: '0.75rem',
                      border: '1px solid #2c2c2c',
                      borderRadius: 12,
                      padding: '0.85rem',
                      marginBottom: '0.65rem',
                    }}
                  >
                    <Field
                      label="Skill name"
                      value={skill.name}
                      onChange={(v) => updateSkill(gi, ii, 'name', v)}
                    />
                    <Field
                      label="Custom logo URL (optional)"
                      value={skill.logo || ''}
                      onChange={(v) => updateSkill(gi, ii, 'logo', v)}
                    />
                    <button
                      type="button"
                      className="btn btn--ghost danger-btn"
                      onClick={() => removeSkill(gi, ii)}
                    >
                      Remove skill
                    </button>
                  </div>
                ))}
                <div className="admin-actions" style={{ marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn--ghost" onClick={() => addSkill(gi)}>
                    Add skill
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost danger-btn"
                    onClick={() => removeSkillGroup(gi)}
                  >
                    Remove group
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn--ghost" onClick={addSkillGroup}>
              Add skill group
            </button>
          </div>
        )}

        {tab === 'Projects' && (
          <div className="admin-grid">
            <Field
              label="Section title"
              value={draft.projects.title}
              onChange={(v) => setPath('projects.title', v)}
            />
            <Field
              label="Subtitle"
              value={draft.projects.subtitle}
              onChange={(v) => setPath('projects.subtitle', v)}
            />
            {(draft.projects.items || []).map((project, pi) => (
              <div
                key={project.id || pi}
                style={{ border: '1px solid #2c2c2c', borderRadius: 14, padding: '1rem' }}
              >
                <Field label="Title" value={project.title} onChange={(v) => updateProject(pi, 'title', v)} />
                <div className="form-row">
                  <Field
                    label="Category"
                    value={project.category}
                    onChange={(v) => updateProject(pi, 'category', v)}
                  />
                  <Field label="Year" value={project.year} onChange={(v) => updateProject(pi, 'year', v)} />
                </div>
                <Field
                  label="Description"
                  value={project.description}
                  onChange={(v) => updateProject(pi, 'description', v)}
                  multiline
                />
                <Field
                  label="Tags (comma separated)"
                  value={(project.tags || []).join(', ')}
                  onChange={(v) => updateProject(pi, 'tags', v)}
                />
                <Field
                  label="Background CSS (gradient or color)"
                  value={project.image}
                  onChange={(v) => updateProject(pi, 'image', v)}
                />
                <div className="form-row">
                  <Field
                    label="Live demo URL (leave empty to hide)"
                    value={project.liveUrl || ''}
                    onChange={(v) => updateProject(pi, 'liveUrl', v)}
                  />
                  <Field
                    label="Source / repo URL (leave empty to hide)"
                    value={project.repoUrl || ''}
                    onChange={(v) => updateProject(pi, 'repoUrl', v)}
                  />
                </div>
                <button type="button" className="btn btn--ghost danger-btn" onClick={() => removeProject(pi)}>
                  Remove project
                </button>
              </div>
            ))}
            <button type="button" className="btn btn--ghost" onClick={addProject}>
              Add project
            </button>
          </div>
        )}

        {tab === 'Contact' && (
          <div className="admin-grid">
            <Field
              label="Title"
              value={draft.contact.title}
              onChange={(v) => setPath('contact.title', v)}
            />
            <Field
              label="Subtitle"
              value={draft.contact.subtitle}
              onChange={(v) => setPath('contact.subtitle', v)}
              multiline
            />
            <Field
              label="Success message"
              value={draft.contact.successMessage}
              onChange={(v) => setPath('contact.successMessage', v)}
              multiline
            />
          </div>
        )}

        {tab === 'Resume' && (
          <div className="admin-grid">
            <p style={{ color: '#9a9a9a', fontSize: '0.92rem' }}>
              Upload a PDF, DOC, or DOCX (max 5MB). Visitors download it from the <strong>Resume</strong>{' '}
              menu item.
            </p>
            {draft.profile?.resume?.available ? (
              <div
                style={{
                  border: '1px solid #2c2c2c',
                  borderRadius: 14,
                  padding: '1rem',
                  background: '#0e0e0e',
                }}
              >
                <p style={{ color: '#eaeaea' }}>
                  Current file: <strong>{draft.profile.resume.originalName || draft.profile.resume.fileName}</strong>
                </p>
                <p className="muted" style={{ marginTop: '0.35rem', fontSize: '0.82rem', color: '#6e6e6e' }}>
                  Uploaded:{' '}
                  {draft.profile.resume.uploadedAt
                    ? new Date(draft.profile.resume.uploadedAt).toLocaleString()
                    : '—'}
                </p>
                <div className="admin-actions" style={{ marginTop: '1rem' }}>
                  <a className="btn btn--ghost" href={apiUrl('/api/resume')} target="_blank" rel="noreferrer">
                    Download current
                  </a>
                  <button
                    type="button"
                    className="btn btn--ghost danger-btn"
                    onClick={async () => {
                      setError('');
                      setStatus('');
                      try {
                        const res = await api.deleteResume();
                        setDraft(res.content);
                        onSaved?.(res.content);
                        setStatus('Resume removed.');
                      } catch (err) {
                        setError(err.message);
                      }
                    }}
                  >
                    Remove resume
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ color: '#6e6e6e' }}>No resume uploaded yet.</p>
            )}

            <div className="field">
              <label htmlFor="resume-file">Upload / replace resume</label>
              <input
                id="resume-file"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (!file) return;
                  setUploading(true);
                  setError('');
                  setStatus('');
                  try {
                    const res = await api.uploadResume(file);
                    setDraft(res.content);
                    onSaved?.(res.content);
                    setStatus(`Resume uploaded: ${res.resume.originalName}`);
                  } catch (err) {
                    setError(err.message);
                  } finally {
                    setUploading(false);
                  }
                }}
              />
            </div>
            {uploading && <p style={{ color: '#9a9a9a' }}>Uploading…</p>}
          </div>
        )}

        {tab === 'Messages' && (
          <div className="messages-list">
            {messages.length === 0 && <p className="muted">No messages yet.</p>}
            {messages.map((msg) => (
              <article key={msg.id} className={`message-item ${msg.read ? '' : 'is-unread'}`}>
                <header>
                  <div>
                    <h3>
                      {msg.name} — {msg.subject || 'No subject'}
                    </h3>
                    <div className="muted">{msg.email}</div>
                  </div>
                  <time>{new Date(msg.createdAt).toLocaleString()}</time>
                </header>
                <p>{msg.message}</p>
                <div className="message-actions">
                  {!msg.read && (
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={async () => {
                        await api.markRead(msg.id);
                        setMessages((prev) =>
                          prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
                        );
                      }}
                    >
                      Mark read
                    </button>
                  )}
                  <a className="btn btn--ghost" href={`mailto:${msg.email}`}>
                    Reply
                  </a>
                  <button
                    type="button"
                    className="btn btn--ghost danger-btn"
                    onClick={async () => {
                      await api.deleteMessage(msg.id);
                      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
                    }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {status && <div className="form-status form-status--ok" style={{ marginTop: '1rem' }}>{status}</div>}
        {error && <div className="form-status form-status--err" style={{ marginTop: '1rem' }}>{error}</div>}

        {tab !== 'Messages' && tab !== 'Resume' && (
          <div className="admin-actions">
            <button className="btn btn--solid" type="button" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <a className="btn btn--ghost" href="#/">
              View site
            </a>
            <button className="btn btn--ghost" type="button" onClick={logout}>
              Log out
            </button>
          </div>
        )}

        {(tab === 'Messages' || tab === 'Resume') && (
          <div className="admin-actions">
            <a className="btn btn--ghost" href="#/">
              View site
            </a>
            <button className="btn btn--ghost" type="button" onClick={logout}>
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
