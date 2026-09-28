# Tech Stack Document
## Government Startup Scheme Recommender — Phase 1

**Version:** 1.0
**Last Updated:** 26 Sept 2026

---

## 1. Stack Overview

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React (Vite) | Component-based SPA, fast dev/build |
| Styling | Tailwind CSS | Utility-first styling, fast iteration |
| Backend | Node.js + Express.js | REST API server |
| Database | MongoDB (Mongoose ODM) | Flexible schema for varied scheme eligibility data |
| Auth | JWT + bcrypt | Stateless auth, secure password storage |
| AI | Claude/OpenAI API | Ranking explanation generation |
| Validation | Zod or Joi / express-validator | Server-side input validation |
| Rate Limiting | express-rate-limit | Protect auth routes from abuse |
| Hosting (Frontend) | Vercel / Netlify | Static SPA hosting, CI/CD friendly |
| Hosting (Backend) | Render / Railway / AWS EC2 | Node API hosting |
| Hosting (DB) | MongoDB Atlas | Managed DB, free tier sufficient for MVP |

## 2. Justification for Key Choices

**React + Vite:** This is a client-heavy SPA (form-driven, dashboard-driven) with no SEO requirement for founder-only pages, so Vite is used for a fast dev/build cycle — quick hot-reload during development and a lean production bundle for Phase 1.

**Tailwind CSS:** Enables rapid, consistent styling without maintaining separate CSS files, and pairs well with a card-heavy, form-heavy UI.

**Express.js over NestJS/Fastify:** Team familiarity and speed of MVP delivery matter more than enterprise structure at this stage; Express is sufficient for the endpoint count in Phase 1.

**MongoDB over PostgreSQL:** Scheme eligibility criteria vary significantly between schemes (some have income caps, some have caste-category requirements, some have sector restrictions) — a flexible document structure avoids constant schema migrations. If strict relational reporting becomes a priority later, this can be revisited.

**JWT (access + refresh) over session-based auth:** Stateless auth scales better across serverless/managed hosting and avoids sticky-session issues if the backend is later scaled horizontally.

**LLM API for explanation only, not core matching:** Core eligibility filtering stays rule-based (deterministic, auditable, no hallucination risk on hard eligibility facts). The LLM is used only for natural-language explanation and fine-grained ranking nuance — this keeps the system reliable even if the AI call fails.

## 3. Folder Structure

### Backend (`/server`)
```
server/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── env.js                # Env variable loader/validator
├── models/
│   ├── User.js
│   ├── FounderProfile.js
│   ├── Scheme.js
│   └── RecommendationLog.js
├── routes/
│   ├── auth.routes.js
│   ├── profile.routes.js
│   ├── recommend.routes.js
│   └── admin.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── profile.controller.js
│   ├── recommend.controller.js
│   └── admin.controller.js
├── services/
│   ├── schemeMatcher.js       # Rule-based filter + scoring logic
│   ├── aiExplainer.js         # LLM API call wrapper
│   └── tokenService.js        # JWT sign/verify helpers
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── errorHandler.js
│   └── validate.js
├── seed/
│   ├── schemes.json
│   ├── seedSchemes.js
│   └── createAdmin.js
├── utils/
│   └── apiResponse.js         # Consistent response envelope helper
├── app.js
├── server.js
└── .env
```

### Frontend (`/client`)
```
client/
├── src/
│   ├── pages/
│   │   ├── Register.jsx
│   │   ├── Login.jsx
│   │   ├── Questionnaire.jsx
│   │   ├── Results.jsx
│   │   ├── Dashboard.jsx
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── SchemesTable.jsx
│   │       └── UsersTable.jsx
│   ├── components/
│   │   ├── SchemeCard.jsx
│   │   ├── StepIndicator.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── AdminRoute.jsx
│   │   └── Navbar.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.js             # Axios instance + endpoint calls
│   ├── hooks/
│   │   └── useAuth.js
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
└── .env
```

## 4. Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
LLM_API_KEY=...
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend `.env`
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 5. Third-Party Dependencies (Backend)

- `express` — server framework
- `mongoose` — MongoDB ODM
- `bcrypt` — password hashing
- `jsonwebtoken` — JWT signing/verification
- `cookie-parser` — parse refresh token cookies
- `cors` — cross-origin config
- `dotenv` — env variable loading
- `express-validator` or `zod` — input validation
- `express-rate-limit` — rate limiting on auth routes
- `morgan` — request logging
- `helmet` — basic security headers

## 6. Third-Party Dependencies (Frontend)

- `react`, `react-dom`
- `react-router-dom` — routing
- `axios` — API calls
- `tailwindcss`, `postcss`, `autoprefixer`
- `react-hook-form` (recommended) — multi-step form state management
- `react-hot-toast` or similar — error/success notifications

## 7. Deployment Plan (MVP)

| Component | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Auto-deploy from main branch, set `VITE_API_BASE_URL` to production backend |
| Backend | Render or Railway | Set all env vars, enable auto-deploy from repo |
| Database | MongoDB Atlas | Free tier (M0) sufficient for MVP; whitelist backend IP |
| Admin Seed | Run `createAdmin.js` once manually post-deploy | Never expose as public endpoint |

## 8. Scaling Considerations (Post-MVP, not built now)

- Add Redis for caching scheme lists and rate-limit counters if traffic grows
- Move LLM calls to a queue (e.g., BullMQ) if recommendation volume spikes, to avoid blocking request threads
- Add CDN for frontend static assets
- Consider read replicas for MongoDB if analytics queries grow heavy

## 9. Local Development Setup (for README)

```bash
# Backend
cd server
npm install
cp .env.example .env   # fill in values
node seed/seedSchemes.js
node seed/createAdmin.js
npm run dev

# Frontend
cd client
npm install
cp .env.example .env
npm run dev
```
