# Cinematic Dark Portfolio

Full-stack portfolio website with a monochrome dark theme, smooth scrolling, cinematic motion, a working **Contact** form, and an **Admin CMS** so you can update every section anytime.

## What's included

| Area | Features |
|------|----------|
| **Home** | Cinematic hero, staggered text reveal, CTAs |
| **About** | Bio, highlights, animated stats |
| **Skills** | Grouped skills with animated progress bars |
| **Projects** | Filter-ready project cards with links |
| **Contact** | Live form → saved in backend (+ optional email) |
| **Admin** | Login-protected editor for all content + inbox |
| **Design** | Black / charcoal / ash / light gray palette, film grain, ambient light |

## Stack

- **Frontend:** React 18 + Vite + Framer Motion
- **Backend:** Node.js + Express
- **Storage:** JSON files in `/data` (no database install required)
- **Auth:** JWT admin login

## Requirements

- [Node.js](https://nodejs.org/) **18+** (LTS recommended)
- npm (comes with Node)

## Quick start

```bash
# 1) Go to the project folder
cd portfolio-website

# 2) Install dependencies
npm install

# 3) Configure environment (optional — defaults already work)
#    Copy .env.example to .env and edit values
copy .env.example .env

# 4) Start API + frontend together
npm run dev
```

Then open:

- **Portfolio:** http://localhost:5173  
- **Admin:** http://localhost:5173/#/admin *(no public Admin button — open this URL directly)*  

Default admin login (from `.env`):

- **Email:** `admin@portfolio.local`  
- **Password:** `ChangeMe123!`  
- **Session:** **30 minutes** (then log in again)

### Resume download

- Public nav includes **Resume** — clicks download the uploaded file  
- Upload/replace from **Admin → Resume** (PDF / DOC / DOCX, max 5MB)

> Change `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` before deploying.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run API (`:5000`) + Vite client (`:5173`) |
| `npm run server` | API only |
| `npm run client` | Frontend only |
| `npm run build` | Production build of the React app |
| `npm start` | Serve API (and built frontend if `NODE_ENV=production`) |
| `npm run seed` | Re-create admin credentials from `.env` |

## Configure your portfolio

### A) Use the Admin panel (recommended)

1. Open http://localhost:5173/#/admin  
2. Log in  
3. Edit **Profile / Hero / About / Skills / Projects / Contact**  
4. Click **Save changes**  
5. Open **Messages** to read Contact form submissions  

### B) Edit the data file directly

All public content lives in:

```
data/content.json
```

Contact submissions are stored in:

```
data/messages.json
```

Restart is **not** required after Admin saves; file edits are picked up on the next API read.

## Contact form (fully working)

1. Visitor submits the Contact section form  
2. Backend validates + rate-limits requests  
3. Message is saved to `data/messages.json`  
4. You can read it in **Admin → Messages**  
5. Optional: configure SMTP in `.env` to also email you  

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
CONTACT_TO_EMAIL=you@email.com
CONTACT_FROM_EMAIL=noreply@yourdomain.com
```

Without SMTP, the form still works — messages are stored and visible in Admin.

## Production / free hosting

See **[DEPLOY.md](./DEPLOY.md)** for:

- Realistic `.env` setup (admin, JWT, optional Gmail SMTP)
- **Render** full-stack (recommended free option)
- **Vercel** or **Netlify** frontend + Render API

```bash
npm run build
# then on the host: NODE_ENV=production npm start
```

## Customize design

Global theme tokens are in:

```
client/src/styles/global.css
```

Fonts: **Syne** (display) + **Sora** (body). Palette uses void black, charcoal panels, ash gray text, and light gray accents — no purple defaults.

## Project structure

```
portfolio-website/
├── client/                 # React + Vite frontend
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       ├── components/     # Home, About, Skills, Projects, Contact…
│       ├── pages/          # Admin + Login
│       └── styles/
├── server/                 # Express API
│   ├── index.js
│   ├── db.js
│   ├── seed.js
│   ├── middleware/
│   └── routes/             # auth, content, contact
├── data/                   # content.json, messages, admin
├── .env.example
└── package.json
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Portfolio stuck on “Loading” | Make sure `npm run dev` is running (API on port 5000) |
| Login fails after changing password | Run `npm run seed` or delete `data/admin.json` and restart |
| Contact “too many messages” | Rate limit is 8 per 15 minutes — wait or restart server |
| Port in use | Change `PORT` or Vite `server.port` in `client/vite.config.js` |

## License

Personal / portfolio use — customize freely.
