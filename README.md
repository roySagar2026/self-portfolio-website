# Cinematic Dark Portfolio

> **A full-stack, cinematic developer portfolio with dynamic content management, JWT-protected administration, a working contact pipeline, resume management, and a carefully engineered monochrome interface.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react\&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite\&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express\&logoColor=white)](https://expressjs.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations-FF0055?logo=framer\&logoColor=white)](https://www.framer.com/motion/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens\&logoColor=white)](https://jwt.io/)

---

## Table of Contents

* [Overview](#overview)
* [Architecture](#architecture)
* [Key Features](#key-features)
* [Tech Stack](#tech-stack)
* [Design System](#design-system)
* [Admin CMS](#admin-cms)
* [Contact System](#contact-system)
* [Resume Management](#resume-management)
* [Authentication & Security](#authentication--security)
* [Quick Start](#quick-start)
* [Installation](#installation)
* [Configuration](#configuration)
* [API Reference](#api-reference)
* [Project Structure](#project-structure)
* [Production Deployment](#production-deployment)
* [Troubleshooting](#troubleshooting)
* [What This Project Is / Isn't](#what-this-project-is--isnt)
* [Roadmap](#roadmap)
* [License](#license)
* [Author](#author)

---

## Overview

This project is a **full-stack personal portfolio platform** built with React and Node.js.

Unlike a traditional static portfolio, the website separates the presentation layer from portfolio content. Content is served through a backend API and can be updated through a protected **Admin CMS** without directly modifying React components.

The project focuses on three areas:

1. **Cinematic frontend experience**
2. **Practical full-stack architecture**
3. **Content management and backend functionality**

The result is a portfolio that behaves more like a small web application than a collection of static pages.

---

## Architecture

### Application Flow

```text
                         ┌──────────────────────┐
                         │       Visitor        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    React + Vite      │
                         │      Frontend        │
                         └──────────┬───────────┘
                                    │
                               REST API
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Node.js + Express  │
                         │      Backend         │
                         └───────┬──────┬───────┘
                                 │      │
                    ┌────────────┘      └────────────┐
                    ▼                                ▼
          ┌──────────────────┐              ┌──────────────────┐
          │  Content Store   │              │ Authentication    │
          │                  │              │                  │
          │ content.json     │              │ JWT              │
          │ messages.json    │              │ bcrypt           │
          │ admin.json       │              │ Protected APIs   │
          └──────────────────┘              └──────────────────┘
                    │
                    ▼
          ┌──────────────────┐
          │   Optional SMTP  │
          │ Email Notification│
          └──────────────────┘
```

### Frontend Architecture

```text
React Application
│
├── Navigation
├── Hero
├── About
├── Skills
├── Projects
├── Contact
├── Resume
│
└── Admin Application
    ├── Login
    ├── Dashboard
    ├── Content Editor
    ├── Resume Manager
    └── Message Inbox
```

### Backend Architecture

```text
Express API
│
├── Authentication
│   ├── Login
│   └── JWT verification
│
├── Content
│   ├── Profile
│   ├── Hero
│   ├── About
│   ├── Skills
│   └── Projects
│
├── Contact
│   ├── Validation
│   ├── Rate limiting
│   ├── Message persistence
│   └── Optional SMTP
│
└── Resume
    ├── Upload
    ├── Replacement
    └── Download
```

---

## Key Features

### Cinematic Hero

* Staggered text reveal
* Smooth entrance animations
* Primary and secondary CTAs
* Responsive layout
* Cinematic typography

### About Section

* Dynamic biography
* Highlight cards
* Animated statistics
* CMS-controlled content

### Skills

* Grouped skill categories
* Animated progress indicators
* Dynamic content
* Responsive presentation

### Projects

* Dynamic project cards
* Project filtering support
* External repository/project links
* CMS-controlled project data

### Contact

* Fully functional frontend form
* Backend validation
* Rate limiting
* Persistent message storage
* Admin inbox
* Optional SMTP notifications

### Resume

* Public resume download
* Admin-controlled upload
* Resume replacement
* PDF / DOC / DOCX support
* 5 MB maximum file size

### Admin CMS

* JWT-protected authentication
* Profile editing
* Hero editing
* About editing
* Skills management
* Project management
* Contact information management
* Resume management
* Contact message inbox

---

## Tech Stack

| Layer            | Technology    |
| ---------------- | ------------- |
| Language         | JavaScript    |
| Frontend         | React 18      |
| Build Tool       | Vite          |
| Animation        | Framer Motion |
| Styling          | CSS           |
| Backend          | Node.js       |
| API              | Express.js    |
| Authentication   | JWT           |
| Password Hashing | bcrypt        |
| Storage          | JSON          |
| Email            | SMTP          |
| Package Manager  | npm           |

---

## Design System

The website intentionally avoids the common purple/blue developer-portfolio aesthetic.

### Visual Language

```text
Void Black
    ↓
Charcoal
    ↓
Ash Gray
    ↓
Light Gray
```

### Design characteristics

* Monochrome color palette
* High contrast
* Large typography
* Minimal interface elements
* Film grain texture
* Ambient background lighting
* Smooth scrolling
* Subtle motion
* Editorial-style spacing

### Typography

**Display:** Syne
**Body:** Sora

Global design tokens are located at:

```text
client/src/styles/global.css
```

---

## Admin CMS

The portfolio includes a private administration interface.

```text
                    Admin Login
                         │
                         ▼
                  JWT Authentication
                         │
                         ▼
                  Admin Dashboard
                         │
       ┌─────────┬───────┼───────┬─────────┐
       ▼         ▼       ▼       ▼         ▼
    Profile    About   Skills  Projects  Contact
       │
       ├───────────────────────┐
       ▼                       ▼
    Resume                  Messages
```

### Content managed by the CMS

* Profile
* Hero
* About
* Skills
* Projects
* Contact information
* Resume
* Contact messages

Changes are persisted to the backend rather than being stored only in browser state.

---

## Contact System

The contact form is implemented as a complete frontend-to-backend workflow.

### Request Flow

```text
Visitor
   │
   ▼
Contact Form
   │
   ▼
POST /api/contact
   │
   ▼
Server Validation
   │
   ▼
Rate Limiting
   │
   ▼
Persist Message
   │
   ├──────────────► data/messages.json
   │
   └──────────────► SMTP (optional)
```

### Behavior

1. Visitor submits the form.
2. Backend validates the request.
3. Rate limiting is applied.
4. Message is saved.
5. Admin can view the message.
6. If SMTP is configured, an email notification is sent.

Without SMTP, the contact form remains fully functional.

---

## Resume Management

The resume system allows the administrator to control the publicly downloadable resume.

### Supported formats

```text
PDF
DOC
DOCX
```

### Maximum size

```text
5 MB
```

### Workflow

```text
Admin
  │
  ▼
Resume Manager
  │
  ▼
Upload / Replace Resume
  │
  ▼
Backend
  │
  ▼
Public Resume Endpoint
  │
  ▼
Visitor Download
```

---

## Authentication & Security

Admin functionality is protected using JWT authentication.

### Authentication flow

```text
Admin Login
    │
    ▼
Validate Credentials
    │
    ▼
Password Verification
    │
    ▼
Generate JWT
    │
    ▼
Protected Admin Requests
```

### Security mechanisms

* JWT authentication
* Password hashing
* Protected admin routes
* Server-side validation
* Contact rate limiting
* Environment-based secrets
* Controlled file upload handling

### Environment secrets

Sensitive values should be stored in `.env`:

```env
ADMIN_EMAIL=your-email
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-long-random-secret
```

> Never commit real credentials or secrets to the repository.

---

## Quick Start

### Prerequisites

* Node.js 18+
* npm

LTS versions are recommended.

### Clone

```bash
git clone <your-repository-url>
cd portfolio-website
```

### Install

```bash
npm install
```

### Configure

```bash
copy .env.example .env
```

Update `.env` if required.

### Start

```bash
npm run dev
```

The development environment runs:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:5000
```

---

## Installation

### Step 1 — Install dependencies

```bash
npm install
```

### Step 2 — Create environment file

```bash
copy .env.example .env
```

### Step 3 — Configure credentials

```env
ADMIN_EMAIL=admin@portfolio.local
ADMIN_PASSWORD=ChangeMe123!
JWT_SECRET=change-this-secret
```

### Step 4 — Start development environment

```bash
npm run dev
```

---

## Admin Access

Open:

```text
http://localhost:5173/#/admin
```

The admin page is intentionally not exposed through the public navigation.

### Default development credentials

```text
Email:    admin@portfolio.local
Password: ChangeMe123!
```

### Session

Default session duration:

**30 minutes**

> Change the credentials and JWT secret before deploying publicly.

---

## Configuration

### Portfolio content

```text
data/content.json
```

### Contact messages

```text
data/messages.json
```

### Admin credentials

```text
data/admin.json
```

### SMTP

Optional SMTP configuration:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password

CONTACT_TO_EMAIL=you@email.com
CONTACT_FROM_EMAIL=noreply@yourdomain.com
```

For Gmail, use an **App Password** instead of your normal account password.

---

## Scripts

| Command          | Description                   |
| ---------------- | ----------------------------- |
| `npm run dev`    | Start frontend + backend      |
| `npm run server` | Start Express API             |
| `npm run client` | Start Vite frontend           |
| `npm run build`  | Build frontend for production |
| `npm start`      | Start production server       |
| `npm run seed`   | Re-create admin credentials   |

---

## API Reference

### Authentication

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| `POST` | `/api/auth/login` | Authenticate admin |

### Content

| Method | Endpoint       | Description                |
| ------ | -------------- | -------------------------- |
| `GET`  | `/api/content` | Retrieve portfolio content |
| `PUT`  | `/api/content` | Update portfolio content   |

### Contact

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| `POST` | `/api/contact`          | Submit contact message  |
| `GET`  | `/api/contact/messages` | Retrieve admin messages |

### Resume

| Method | Endpoint      | Description             |
| ------ | ------------- | ----------------------- |
| `GET`  | `/api/resume` | Download current resume |
| `POST` | `/api/resume` | Upload / replace resume |

> Exact routes depend on the current implementation in `server/routes/`. The route files are the authoritative API reference.

---

## Project Structure

```text
portfolio-website/
│
├── client/
│   ├── index.html
│   ├── vite.config.js
│   │
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       │
│       ├── components/
│       │   ├── Home
│       │   ├── About
│       │   ├── Skills
│       │   ├── Projects
│       │   └── Contact
│       │
│       ├── pages/
│       │   ├── Admin
│       │   └── Login
│       │
│       └── styles/
│           └── global.css
│
├── server/
│   ├── index.js
│   ├── db.js
│   ├── seed.js
│   │
│   ├── middleware/
│   │
│   └── routes/
│       ├── auth
│       ├── content
│       └── contact
│
├── data/
│   ├── content.json
│   ├── messages.json
│   └── admin.json
│
├── .env.example
├── DEPLOY.md
├── package.json
└── README.md
```

---

## Production Deployment

The application can be deployed as a full-stack application or as separate frontend and backend services.

### Full Stack

```text
                 Render
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
   React Build            Express API
        │                     │
        └──────────┬──────────┘
                   ▼
              JSON Storage
```

### Split Deployment

```text
Vercel / Netlify
       │
       │ Frontend
       ▼
    Render
       │
       │ API
       ▼
    Backend
```

### Production build

```bash
npm run build
```

### Start production server

```bash
NODE_ENV=production npm start
```

See:

```text
DEPLOY.md
```

for deployment-specific configuration.

---

## Environment Variables

Example:

```env
# Server
PORT=5000
NODE_ENV=development

# Admin
ADMIN_EMAIL=admin@portfolio.local
ADMIN_PASSWORD=ChangeMe123!

# Authentication
JWT_SECRET=your-secret

# SMTP - Optional
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
CONTACT_TO_EMAIL=you@email.com
CONTACT_FROM_EMAIL=noreply@yourdomain.com
```

> Production secrets should be configured through the hosting provider's environment-variable system.

---

## Troubleshooting

### Portfolio stuck on `Loading`

Make sure the API is running:

```bash
npm run dev
```

Verify:

```text
http://localhost:5000
```

---

### Admin login fails

Regenerate admin credentials:

```bash
npm run seed
```

If necessary, remove:

```text
data/admin.json
```

and recreate the credentials using `.env`.

---

### Contact form returns rate-limit error

The contact endpoint is limited to:

**8 messages per 15 minutes**

Wait until the rate-limit window expires before trying again.

---

### SMTP email is not being received

Check:

* SMTP host
* SMTP port
* SMTP username
* SMTP password / App Password
* `CONTACT_TO_EMAIL`
* Spam / junk folder

The message should still appear in the admin inbox even if SMTP is unavailable.

---

### Port already in use

Change:

```text
PORT
```

in `.env`, or change the Vite development server port in:

```text
client/vite.config.js
```

---

## What This Project Is / Isn't

### Demonstrates

* Full-stack React architecture
* REST API integration
* Node.js backend development
* Express middleware
* JWT authentication
* Password hashing
* CMS architecture
* Server-side validation
* Rate limiting
* File uploads
* SMTP integration
* JSON persistence
* Responsive frontend engineering
* Animation systems
* Production deployment

### Does not include

* Database-backed persistence
* Multi-user CMS
* OAuth authentication
* Enterprise-grade RBAC
* Cloud object storage
* Production-scale analytics
* High-availability infrastructure

This is a **personal portfolio application**, not an enterprise CMS platform.

---

## Roadmap

### Current

* Cinematic portfolio UI
* Responsive frontend
* Dynamic portfolio content
* Admin CMS
* JWT authentication
* Contact form
* Message inbox
* Resume management
* Optional SMTP
* JSON persistence
* Framer Motion animations

### Planned

* [ ] PostgreSQL persistence
* [ ] Cloud resume/file storage
* [ ] Refresh-token rotation
* [ ] Role-based admin access
* [ ] Project image management
* [ ] Analytics dashboard
* [ ] Visitor analytics
* [ ] Automated email templates
* [ ] GitHub Actions CI/CD
* [ ] Automated frontend/backend tests
* [ ] SEO optimization
* [ ] Accessibility audit

---

## License

Personal / portfolio use.

Customize freely for your own portfolio.

---

## Author

**Sagar Roy**

Computer Science & Engineering Student focused on:

* Software Engineering
* Backend Engineering
* Systems Programming
* Quantitative Development
* High-Performance Computing

GitHub: [@roySagar2026](https://github.com/roySagar2026)

---

<p align="center">
  Built with React, Node.js, and an obsession with clean engineering.
</p>
