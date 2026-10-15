# CareerForge – Server

Express 5 (ES modules) REST API backed by MongoDB (Mongoose), with Socket.IO for real-time notifications. See the [root README](../README.md) for the overall picture.

## Run

```bash
npm install
cp .env.example .env   # fill in values
npm run dev            # nodemon server.js
npm start              # node server.js
node seeds/seedCategories.js   # seed blog categories
```

Default port is `process.env.PORT || 8080`. Health check: `GET /api/v1/health`.

## Layout

| Path | Role |
|---|---|
| `server.js` | loads env, creates HTTP server, `initSocket`, `connectDB`, listens |
| `app.js` | Express app: CORS, Stripe raw-body webhook, JSON parsing, route mounting, error middleware |
| `router/` | route definitions per resource |
| `controller/` | request handlers (auth, user, cv, cv_parser, ai, blog, blogProfile, notification, stripe) |
| `model/` | Mongoose models: User, Cv, Post, Comment, Category, BlogProfile, Notification |
| `schemas/` | Zod request schemas, applied by `middleWare/validate.js` |
| `middleWare/` | `authMiddleWare` (JWT), error handler, multer upload, JSON-field parser, rate limiters |
| `config/` | `db`, `socket`, `cloudinary`, `groq`, `nodemailer` |
| `handler/` | `AsyncHandler`, `CustomError` |
| `utils/` | tokens, cookie options, Cloudinary upload, mail sending, `apiFeatures`, user sanitizing |
| `template/` | HTML email templates |
| `seeds/` | category seed script |

## Environment variables

Placeholders only; see `.env.example` for the production URLs.

```
NODE_ENV=development
PORT=8080
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
APP_URL=http://localhost:8080
MONGO_URI=<mongodb connection string>
ACCESS_TOKEN_SECRET=<random string>
REFRESH_TOKEN_SECRET=<random string>
EMAIL=<smtp user>
NODEMAILER_PASS=<smtp password>
GOOGLE_CLIENT_ID=<id>
LINKEDIN_CLIENT_ID=<id>
LINKEDIN_CLIENT_SECRET=<secret>
LINKEDIN_CALLBACK_URL=<callback url>
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
GROQ_API_KEY=<key>
# Optional: comma-separated model priority list (default: openai/gpt-oss-120b,qwen/qwen3.8-27b,openai/gpt-oss-20b)
GROQ_MODELS=<model1,model2,...>
# Optional: per-model timeout in ms (default 20000)
GROQ_TIMEOUT_MS=<ms>
STRIPE_SECRET_KEY=<key>
STRIPE_WEBHOOK_SECRET=<secret>
STRIPE_PRICE_CV_WRITING=<price id>
STRIPE_PRICE_LINKEDIN=<price id>
STRIPE_PRICE_COVER_LETTER=<price id>
```

## API

Base path `/api/v1`. "Auth" means `Authorization: Bearer <access token>`.

| Mount | Method & path | Auth | Purpose |
|---|---|---|---|
| `/auth` | `POST /register`, `POST /login`, `POST /google` | – | sign up / in (rate-limited, Zod-validated) |
| | `GET /linkedin/start`, `GET /linkedin/callback` | – | LinkedIn OAuth |
| | `POST /refresh-Token`, `POST /logout` | cookie | token refresh / logout |
| `/user` | `POST /change-password`, `PUT /update-email`, `POST /update-profile-pic` | yes | account settings |
| | `POST /forget_password`, `POST /resetpassword/:token` | – | password reset (rate-limited) |
| | `GET`/`PUT /blog-profile`, `GET /blog-profile/:userId` | yes / public | blog profile |
| `/cv` | `POST /cv`, `GET /cv` | yes | create / list CVs |
| | `GET`/`PUT`/`DELETE /cv/:id` | yes | single CV |
| | `POST /save-draft`, `GET /my-drafts`, `PUT /finalize/:id`, `GET`/`PUT`/`DELETE /:id` | yes | drafts |
| `/ai` | `POST /ai-generate` | yes | AI content generation (Groq) |
| | `POST /upload-and-extract` | yes | parse PDF/DOCX resume (max 5 MB) |
| `/blog` | `GET /categories`, `GET /`, `GET /:slug` | – | read posts |
| | `GET /mine`, `POST /`, `PUT /:id`, `DELETE /:id`, `POST /:id/like` | yes | manage posts and likes |
| | `GET`/`POST /:postId/comments`, `DELETE /:postId/comments/:commentId` | public / yes | comments |
| `/notification` | `GET /`, `PATCH /:notificationId/read`, `PATCH /read-all` | yes | notifications |
| `/stripe` | `POST /create-checkout-session`, `/verify-session`, `/cancel-subscription` | yes | subscriptions |
| | `POST /webhook` | Stripe signature | webhook (raw body, mounted before `express.json`) |
| – | `GET /health` | – | liveness |

## Behavior notes

- **Auth:** access token JWT expires in 15 min; refresh token JWT in 2 days, stored in an httpOnly cookie (`SameSite=None; Secure` in production). Cookie options in `utils/cookiesOption.js`.
- **Errors:** controllers are wrapped in `AsyncHandler`; failures use `CustomError` and `errorMiddleWare`.
- **Validation:** Zod schemas in `schemas/`; uploads use multer with type and size limits.
- **Blog views:** `Post.viewedBy` ensures a logged-in account increments views once.
- **Rate limiting:** per-route limiters in `middleWare/rateLimiters.js` (register, login, forgot/reset password, blog `apiLimiter`). The global limiter in `app.js` is commented out.
- **Realtime:** the client connects with `query.userId`; `sendSocketNotification` emits to that user's sockets. Socket CORS origin is `CLIENT_URL` (fallback `http://localhost:5173`).
- **AI models:** generation (`/ai/ai-generate`) tries `GROQ_MODELS` in priority order with a per-model timeout (`utils/aiFallback.js`), falling back on 400/404/408/429/5xx, timeouts and malformed JSON; 401/403 fail fast. Resume parsing uses `openai/gpt-oss-120b`. All via Groq.
- **Stripe price IDs** fall back to hard-coded IDs when the env vars are unset; set them explicitly for your own Stripe account.

## Testing

`npm test` runs the Node built-in test runner (`test/aiFallback.test.js`, AI model fallback). Otherwise verify manually with `GET /api/v1/health` and the client.
