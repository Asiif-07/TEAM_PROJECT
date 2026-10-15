# CareerForge

A career-tools web app: build and manage CVs (with AI assistance and CV import), publish and read career-related blog posts, and buy career services via Stripe subscriptions. It is a two-package repo:

| Folder | What | Docs |
|---|---|---|
| [`client/`](client/) | React 18 + Vite single-page app | [client/README.md](client/README.md) |
| [`server/`](server/) | Express 5 + MongoDB REST API with Socket.IO | [server/README.md](server/README.md) |

## Features

- **Authentication:** email/password registration and login, Google sign-in, LinkedIn OAuth, password reset by email, JWT access token + httpOnly refresh cookie.
- **CV builder:** multi-step builder with live preview and templates, drafts, finalize, per-user CV list, profile image upload (Cloudinary).
- **AI:** AI-generated CV content and resume upload/extraction (PDF/DOCX), both via Groq.
- **Blog:** posts with images and categories, likes, comments, per-author public profiles, view counting once per logged-in account.
- **Notifications:** persisted notifications plus real-time delivery over Socket.IO.
- **Payments:** Stripe Checkout subscriptions for services (CV Writing, LinkedIn Optimization, Cover Letter Service).
- **i18n:** `i18next` with browser language detection.

## Architecture

```
Browser (React SPA, Vercel)
   │  fetch  /api/v1/*   (same-origin; proxied by Vercel rewrite / Vite dev proxy)
   ▼
Express API (Render)  ── MongoDB (Mongoose)
   │                  ── Cloudinary (images), Stripe, Groq, SMTP (nodemailer), Google/LinkedIn OAuth
   └── Socket.IO  ◄──── client socket.io connection (query: userId)
```

- The client talks to the API through `client/src/api/http.js` (`apiRequest`), which adds the `Authorization: Bearer` header, retries on transient failures and refreshes the token on 401.
- Base URL comes from `VITE_API_BASE_URL`, defaulting to `/api/v1`. `client/vercel.json` and the dev proxy in `client/vite.config.js` rewrite `/api` to `https://team-project-qa0v.onrender.com`.

## Directory structure

```
.
├── client/            React app (see client/README.md)
│   ├── src/api        fetch wrappers per resource
│   ├── src/components UI (auth, blog, cvBuilder, layout, sections, common)
│   ├── src/context    Auth, Socket, Notification providers
│   ├── src/pages      route pages (auth, dashboard, Blog)
│   ├── src/store      Zustand blog store
│   └── vercel.json    SPA + API rewrites
├── server/            Express API (see server/README.md)
│   ├── router/ controller/ model/ schemas/ middleWare/ config/ utils/ template/ seeds/
│   ├── app.js         Express app, CORS, routes
│   └── server.js      HTTP server, DB connect, Socket.IO
├── TODO.md, TODO-steps.md   working notes
└── .graphifyignore    Graphify exclusions
```

## Prerequisites

- Node.js (a current LTS; both packages are ES modules) and npm
- A MongoDB database (Atlas or local)
- Accounts/keys for the services you use: Cloudinary, Stripe, Groq, an SMTP account, Google/LinkedIn OAuth apps (optional per feature)

## Setup

```bash
# server
cd server
npm install
cp .env.example .env     # then fill in values (see server/README.md)
npm run dev              # nodemon on PORT (default 8080)

# client (new terminal)
cd client
npm install
npm run dev              # Vite on http://localhost:5173
```

### Environment variables

Never commit real values. Placeholders only:

| Where | Variable | Purpose |
|---|---|---|
| server | `MONGO_URI`, `PORT`, `NODE_ENV` | DB and runtime |
| server | `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET` | JWT signing |
| server | `FRONTEND_URL`, `CLIENT_URL`, `APP_URL` | CORS / redirects |
| server | `EMAIL`, `NODEMAILER_PASS` | outgoing mail |
| server | `GOOGLE_CLIENT_ID`, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_CALLBACK_URL` | OAuth |
| server | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | image upload |
| server | `GROQ_API_KEY` | AI features |
| server | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_CV_WRITING`, `STRIPE_PRICE_LINKEDIN`, `STRIPE_PRICE_COVER_LETTER` | payments |
| client | `VITE_API_BASE_URL` | API base (default `/api/v1`) |
| client | `VITE_SOCKET_URL` | Socket.IO server (default `http://localhost:2000` in code) |
| client | `VITE_GOOGLE_CLIENT_ID` | Google sign-in |

Local note: the server listens on `PORT` (default `8080`), while the client's socket fallback is `http://localhost:2000`. Set `PORT` and `VITE_SOCKET_URL` to match.

## Scripts

| Package | Command | Does |
|---|---|---|
| server | `npm start` | `node server.js` |
| server | `npm run dev` | `nodemon server.js` |
| server | `node seeds/seedCategories.js` | seed blog categories (no npm script) |
| client | `npm run dev` / `build` / `preview` / `lint` | Vite dev, build, preview, ESLint |

No automated tests exist (`server` `npm test` is a placeholder).

## API overview

All routes are under `/api/v1`. Details are in [server/README.md](server/README.md).

- `/auth` – register, login, google, linkedin start/callback, refresh-Token, logout
- `/user` – change password, update email/profile picture, forgot/reset password, blog profile
- `/cv` – CV CRUD, drafts, finalize
- `/ai` – AI generation, resume upload-and-extract
- `/blog` – posts, categories, likes, comments
- `/notification` – list, mark read
- `/stripe` – checkout session, verify, cancel, webhook
- `/health` – liveness check

## Authentication flow

1. Login/register/OAuth returns a short-lived access token (15 minutes, JWT) and sets a refresh token in an httpOnly cookie (JWT, 2 days).
2. The client sends `Authorization: Bearer <access token>`; `authMiddleWare` verifies it and loads the user.
3. On a 401 the client calls `POST /auth/refresh-Token` and retries once.
4. Protected client routes use `RequireAuth`.

## Deployment

- **Client:** Vercel. `client/vercel.json` rewrites `/api/v1/*` to the Render backend and everything else to `index.html`.
- **Server:** Render (`server/.env.example` is labelled for Render). Set `NODE_ENV=production`, the CORS URLs, and all secrets in the dashboard. CORS also allows any `https://*.vercel.app` origin and `https://carrerforge.vercel.app`.
- Stripe webhook endpoint: `POST /api/v1/stripe/webhook`.

## Troubleshooting

- **CORS blocked:** make sure `FRONTEND_URL`/`CLIENT_URL` match the browser origin exactly.
- **Server exits at startup:** `MONGO_URI` is missing or unreachable.
- **Slow first request in production:** the Render backend may be waking up; the client retries.
- **PDF generation:** `server/utils/pdfGenerator.js` imports `puppeteer-core` and `./findBrowser.js`, neither of which is present in the repo or in `server/package.json`. The file is not imported anywhere, so it is currently dead code.
- **Unused dependencies:** `@google/generative-ai` and `openai` are listed in `server/package.json` but not referenced in the source.

## Code graph (Graphify)

[Graphify](https://github.com/Graphify-Labs/graphify) (PyPI `graphifyy`) turns the repo into a queryable knowledge graph. Code is parsed locally with tree-sitter; no API key is needed for code-only builds.

```bash
pip install graphifyy          # once; Python 3.10+
python -m graphify update .    # build/refresh graphify-out/ (or `graphify update .` if on PATH)
python -m graphify query "how does a like create a notification"
python -m graphify explain "likePost()"
python -m graphify path "likePost()" "createNotification()"
```

Output goes to `graphify-out/` (`graph.html`, `GRAPH_REPORT.md`, `graph.json`), which is git-ignored. Exclusions live in `.graphifyignore`.
