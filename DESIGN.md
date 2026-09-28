# System & UX Design Document
## Government Startup Scheme Recommender — Phase 1

**Version:** 1.0
**Last Updated:** 26 Sept 2026

---

## 1. High-Level Architecture

```
┌─────────────────────┐         ┌──────────────────────┐         ┌─────────────────┐
│   React Frontend     │  HTTPS  │   Express Backend     │  calls  │   LLM API        │
│  (Vite + Tailwind)   │◄───────►│   (Node.js REST API)  │────────►│ (Claude/OpenAI)  │
└─────────────────────┘         └──────────┬───────────┘         └─────────────────┘
                                            │
                                            ▼
                                 ┌──────────────────────┐
                                 │      MongoDB          │
                                 │  (Users, Profiles,    │
                                 │   Schemes, Logs)      │
                                 └──────────────────────┘
```

- **Frontend:** SPA served separately (Vercel/Netlify), talks to backend via REST + JWT auth headers/cookies.
- **Backend:** Stateless Express API, horizontally scalable, handles auth, business logic, and orchestrates the AI call.
- **Database:** MongoDB for flexible scheme eligibility structures (varies a lot per scheme).
- **AI Layer:** Called server-side only (never expose API key to frontend). Used for ranking explanation text on top of rule-based filtering.

## 2. Data Model

### 2.1 User
```
User {
  _id: ObjectId
  name: String
  email: String (unique, indexed)
  passwordHash: String
  role: "founder" | "admin"
  isVerified: Boolean (default false)
  createdAt: Date
  updatedAt: Date
}
```

### 2.2 FounderProfile
```
FounderProfile {
  _id: ObjectId
  userId: ObjectId (ref: User, indexed)
  industry: String
  businessStage: "idea" | "mvp" | "early_revenue" | "scaling"
  state: String
  teamSize: Number
  fundingNeeded: { min: Number, max: Number }
  businessType: "tech" | "manufacturing" | "services" | "agriculture" | "other"
  womenLed: Boolean
  scStFounder: Boolean
  differentlyAbledFounder: Boolean
  dpiitRegistered: "yes" | "no" | "not_sure"
  createdAt: Date
  updatedAt: Date
}
```

### 2.3 Scheme
```
Scheme {
  _id: ObjectId
  name: String
  issuingBody: String
  level: "central" | "state"
  state: String (null if central)
  sectorTags: [String]
  businessStageEligibility: [String]   // e.g. ["idea", "mvp"]
  eligibilityCriteria: {
    minTeamSize: Number,
    maxTeamSize: Number,
    dpiitRequired: Boolean,
    specialCategoryOnly: [String],      // e.g. ["women", "sc_st"]
    other: String                        // free-text notes for edge cases
  }
  fundingAmount: { min: Number, max: Number }
  fundingType: "grant" | "loan" | "subsidy" | "equity" | "other"
  applicationLink: String (URL)
  deadline: Date (null if rolling)
  description: String
  isActive: Boolean (default true)
  createdBy: ObjectId (ref: User, admin)
  createdAt: Date
  updatedAt: Date
}
```

### 2.4 RecommendationLog
```
RecommendationLog {
  _id: ObjectId
  userId: ObjectId (ref: User)
  profileSnapshot: Object   // copy of FounderProfile at time of run
  recommendedSchemes: [
    { schemeId: ObjectId, matchScore: Number, explanation: String }
  ]
  generatedAt: Date
}
```

**Indexing notes:** index `User.email`, `FounderProfile.userId`, `Scheme.isActive + sectorTags + state`, `RecommendationLog.userId`.

## 3. API Design

Base URL: `/api`

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | /auth/register | Public | Founder signup |
| POST | /auth/login | Public | Login, returns access token + sets refresh cookie |
| POST | /auth/refresh | Public (cookie) | Issue new access token |
| POST | /auth/logout | Authenticated | Clear refresh token |
| GET | /auth/me | Authenticated | Return current user |

### Founder
| Method | Route | Access | Description |
|---|---|---|---|
| POST | /profile | Founder | Create/update questionnaire profile |
| GET | /profile | Founder | Get own profile |
| POST | /recommend | Founder | Run recommendation engine |
| GET | /recommend/history | Founder | Past recommendation runs |

### Admin
| Method | Route | Access | Description |
|---|---|---|---|
| GET | /admin/schemes | Admin | List schemes (paginated, filterable) |
| POST | /admin/schemes | Admin | Create scheme |
| PUT | /admin/schemes/:id | Admin | Update scheme |
| DELETE | /admin/schemes/:id | Admin | Soft delete scheme |
| GET | /admin/users | Admin | List founders (no password data) |
| GET | /admin/analytics | Admin | Usage stats |

**Response envelope (consistent across all endpoints):**
```json
{ "success": true, "message": "...", "data": { } }
```

## 4. Recommendation Engine Logic

```
Input: FounderProfile
Step 1 — Hard Filter (rule-based, in schemeMatcher.js):
  - isActive === true
  - state matches OR level === "central"
  - businessStage in scheme.businessStageEligibility
  - teamSize within min/max bounds
  - if dpiitRequired, founder.dpiitRegistered === "yes"
  - if specialCategoryOnly set, founder must match at least one flag

Step 2 — Scoring (weighted):
  - sector tag overlap: 40%
  - funding range fit: 25%
  - stage match closeness: 20%
  - special category bonus: 15%
  → produces matchScore (0–100) per surviving scheme

Step 3 — Rank & Shortlist:
  - Take top 7 by matchScore

Step 4 — AI Explanation Layer:
  - Send founder profile + shortlisted schemes to LLM
  - Prompt: "Explain in 1–2 plain-English sentences why each scheme fits this founder"
  - Attach explanation text to each scheme

Step 5 — Fallback:
  - If LLM call fails/times out, use a templated explanation:
    "Recommended because your {sector} business at {stage} stage matches this scheme's {criteria}."

Output: top schemes with matchScore + explanation, saved to RecommendationLog
```

## 5. Frontend UX Flow

```
[Landing Page] → [Register/Login] → [Questionnaire (multi-step)] → [Results Page] → [Dashboard]
                                                                        │
                                                            [Admin Login] → [Admin Dashboard]
                                                                              ├─ Schemes CRUD
                                                                              ├─ Users list
                                                                              └─ Analytics
```

### Key Screens

**1. Questionnaire (multi-step form)**
- Step indicator at top (e.g., 1 of 5)
- One logical group of fields per step (business basics → stage/funding → founder category flags)
- "Back"/"Next" navigation, final "Get My Recommendations" CTA
- Pre-fills if a profile already exists (edit mode)

**2. Results Page**
- Card grid, one card per scheme:
  - Scheme name + issuing body badge (central/state)
  - Match % (visual bar or badge)
  - Funding amount + type
  - "Why this fits you" (AI explanation, 1–2 lines)
  - Deadline chip (if applicable)
  - "Apply Now" button → external link (opens in new tab)
- Filter bar: sector, funding range, deadline sort
- Empty state: if zero matches, show guidance ("Try adjusting your business stage or check back as we add new schemes")

**3. Dashboard**
- Profile summary card with "Edit Profile" link
- List of past recommendation runs (collapsed, expandable)

**4. Admin Dashboard**
- Top-level stats: total founders, total recommendation runs, schemes count
- Table view for schemes: search, filter by state/sector/status, inline edit/deactivate
- Add Scheme modal/form matching the Scheme schema
- Read-only founders table

## 6. Visual/Design Direction

- Clean, trustworthy, "govt-tech" feel without looking dated — use Tailwind with a restrained palette (deep blue/teal primary, white/light gray background, one accent color for CTAs)
- Card-based layout for scannability (founders are comparing multiple options at a glance)
- Progress indicators for the multi-step form to reduce drop-off
- Match % shown visually (progress bar or colored badge: green >80%, yellow 50–80%, gray <50%)
- Mobile-first responsive breakpoints since many founders will check on phones

## 7. Error & Edge Case Handling

- No matching schemes → helpful empty state, not a blank page
- LLM API timeout/failure → fallback explanation, recommendation still returns
- Expired/inactive scheme still referenced in old RecommendationLog → display as "No longer active" rather than breaking the history view
- Duplicate scheme entries in admin → validate on unique `name + issuingBody` combo
- Session expiry mid-questionnaire → autosave draft to avoid data loss (nice-to-have, flag if deferred)

## 8. Security Design Notes

- Passwords hashed with bcrypt (cost factor ≥ 10)
- JWT access token short-lived (15 min), refresh token in httpOnly, secure, sameSite cookie
- Admin routes protected by role middleware, never reachable by `founder` role
- No public admin registration endpoint — admin accounts created via seed script only
- Rate-limit `/auth/login` and `/auth/register` to prevent brute force
- All inputs validated/sanitized server-side regardless of frontend validation
