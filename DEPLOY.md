# Deploy this portfolio (free options)

Your app is **React (Vite) + Express**. Contact messages, admin CMS, and resume uploads need a real Node server.

| Host | What works | Notes |
|------|------------|--------|
| **Render (recommended)** | Frontend + API together | Free Web Service — easiest |
| **Vercel / Netlify** | Frontend only | Pair with Render API |
| Vercel/Netlify alone | ❌ Not enough | No durable Express + file uploads |

---

## 1) Configure environment (realistic values)

### Local — edit `.env` in project root

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

ADMIN_EMAIL=your.real.email@gmail.com
ADMIN_PASSWORD=UseAStrongPassword!
JWT_SECRET=make-this-a-long-random-string-32plus-chars

RESEED_ADMIN=false

# Optional contact emails (Gmail: use an App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.real.email@gmail.com
SMTP_PASS=your-16-char-app-password
CONTACT_TO_EMAIL=your.real.email@gmail.com
CONTACT_FROM_EMAIL=your.real.email@gmail.com
```

Generate a JWT secret (PowerShell):

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

After changing admin password in `.env`, set `RESEED_ADMIN=true`, run once (`npm run server` or redeploy), then set it back to `false`.

### Frontend API URL (only for Vercel/Netlify split)

Create `client/.env.production` (or set in host dashboard):

```env
VITE_API_URL=https://YOUR-API.onrender.com
```

Leave this **empty** when using Render full-stack (same domain).

---

## 2) Recommended: deploy everything on Render (free)

1. Push this repo to GitHub  
2. Sign up at [https://render.com](https://render.com)  
3. **New → Web Service →** connect the repo  
4. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance:** Free  
5. Environment variables:

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `ADMIN_EMAIL` | your email |
| `ADMIN_PASSWORD` | strong password |
| `JWT_SECRET` | long random string |
| `CLIENT_ORIGIN` | `*` (or `https://your-service.onrender.com`) |
| `RESEED_ADMIN` | `false` |
| SMTP_* | optional |

6. Deploy → open `https://YOUR-SERVICE.onrender.com`  
7. Admin: `https://YOUR-SERVICE.onrender.com/#/admin`  
8. Upload resume under **Admin → Resume**

**Free tier note:** the service sleeps after ~15 min idle (first load may be slow). Disk can reset on redeploy — re-upload resume / re-save content if that happens. Keep important content in `data/content.json` in git.

You can also use the included `render.yaml` (**New → Blueprint**).

---

## 3) Frontend on Vercel (free) + API on Render

### A) API on Render
Same as above, but you only need the API. Still use `npm install && npm run build && npm start` (build is fine even if you mainly use API).

Set:

```env
CLIENT_ORIGIN=https://YOUR-SITE.vercel.app
```

### B) Frontend on Vercel
1. [vercel.com](https://vercel.com) → Import Git repo  
2. Framework: Other  
3. Build: `npm run build`  
4. Output: `client/dist`  
5. Env: `VITE_API_URL=https://YOUR-API.onrender.com`  
6. Deploy  

`vercel.json` is already in the repo.

---

## 4) Frontend on Netlify (free) + API on Render

1. [netlify.com](https://netlify.com) → Import repo  
2. Build: `npm run build`  
3. Publish: `client/dist`  
4. Env: `VITE_API_URL=https://YOUR-API.onrender.com`  
5. On Render set `CLIENT_ORIGIN=https://YOUR-SITE.netlify.app`  

`netlify.toml` is already in the repo.

---

## 5) Local production smoke test

```bash
npm install
npm run build
# PowerShell:
$env:NODE_ENV="production"; $env:CLIENT_ORIGIN="http://localhost:5000"; npm start
```

Open http://localhost:5000

---

## 6) Go-live checklist

- [ ] Change `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `JWT_SECRET`  
- [ ] Update About / Projects / Skills in Admin with your real info  
- [ ] Upload resume (PDF)  
- [ ] Send a test contact message  
- [ ] (Optional) Configure SMTP so contact emails reach your inbox  
- [ ] Share your public URL (Render, or Vercel/Netlify + Render)

---

## Why not Vercel/Netlify for the API?

They are great for static/JAMstack frontends. This portfolio’s admin, contact inbox, and resume upload need a long-running Node process and writable storage — **Render’s free Web Service** fits that without paid add-ons.
