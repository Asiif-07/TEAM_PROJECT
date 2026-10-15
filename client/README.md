# CareerForge – Client

React 18 single-page app built with Vite. See the [root README](../README.md) for the full system and the [server README](../server/README.md) for the API.

## Stack

React 18, Vite 7, React Router 6 (`createBrowserRouter`, lazy-loaded pages), Tailwind CSS 4 (`@tailwindcss/vite`), MUI 7 + Emotion, Zustand (blog store), `socket.io-client`, i18next, Zod, react-hot-toast, react-quill-new (rich-text editor), react-markdown, react-to-print, `@react-oauth/google`, `react-linkedin-login-oauth2`, Stripe.js.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the build
npm run lint      # ESLint
```

## Environment (`client/.env`)

```
VITE_API_BASE_URL=/api/v1
VITE_SOCKET_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=<google oauth client id>
```

- `VITE_API_BASE_URL` defaults to `/api/v1` (see `src/utils/apiBaseUrl.js`).
- `VITE_SOCKET_URL` falls back to `http://localhost:2000` in `SocketContext.jsx`; point it at your server's `PORT`.
- In dev, Vite proxies `/api` to `https://team-project-qa0v.onrender.com` (`vite.config.js`). Change the `target` to `http://localhost:8080` to use a local server.

## Structure

| Path | Role |
|---|---|
| `src/main.jsx` | providers: GoogleOAuth, Auth, Socket, Notification, RouterProvider |
| `src/router.jsx` | all routes; protected ones wrapped in `components/auth/RequireAuth` |
| `src/api/` | per-resource wrappers over `http.js` (`apiRequest`: auth header, 15 s timeout, retries, 401 refresh, toasts) |
| `src/context/` | `AuthContext`, `SocketContext`, `NotificationContext` |
| `src/store/useBlogStore.js` | Zustand store for posts, categories, drafts |
| `src/hooks/useCVDraft.js` | CV draft handling |
| `src/pages/` | public pages, `auth/`, `dashboard/`, `Blog/` |
| `src/components/` | `auth`, `blog` (+ editor), `cvBuilder` (steps, templates, preview), `layout`, `sections`, `common` |
| `src/utils/` | `i18n`, API base URL, Google script loader, blog and `cvBuilder/` helpers (templates config/schemas, data mapping) |
| `vercel.json` | rewrites `/api/v1/*` to the Render backend; SPA fallback |

## Routes

Public: `/`, `/about`, `/how-it-works`, `/blogs`, `/blogs/:slug`, `/author/:id`, `/contact-us`, `/services`, `/cv-templates`, `/cv-builder`, `/login`, `/signup`, `/forgot-password`, `/reset-password/:token`, `/oauth/google-done`, `/oauth/linkedin-done`.

Requires login (`RequireAuth`): `/dashboard`, `/blogs/create`, `/blogs/edit/:slug`, `/profile`, `/blog-profile`, `/my-cvs`, `/my-blogs`.

## Notes

- Auth state and token refresh live in `AuthContext`; sockets connect only when authenticated, passing `userId` in the handshake query.
- CV templates are components in `components/cvBuilder/templates/`, selected through `utils/cvBuilder/templateConfig.js`.
- `src/pages/Blog.jsx` and `Blog_Details.jsx` are not used by the router (it uses `pages/Blog/BlogFeed.jsx` and `PostDetail.jsx`).
- No test runner is configured.
