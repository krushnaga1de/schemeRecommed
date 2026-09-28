# Product Requirements Document (PRD)
## Government Startup Scheme Recommender — Phase 1

**Version:** 1.0
**Status:** Draft for build
**Owner:** [Your Name / Team]
**Last Updated:** 26 Sept 2026

---

## 1. Problem Statement

Indian founders lose time and funding opportunities because government startup schemes (central + state) are scattered across dozens of portals, written in dense bureaucratic language, and hard to match against a specific business's stage, sector, and founder profile. Most founders either don't know a relevant scheme exists or apply to schemes they don't qualify for.

## 2. Objective

Build a web application where a founder answers a short questionnaire about their business and instantly receives a ranked, explained list of government schemes they are eligible for — with clear next steps and application links.

This is **Phase 1** of a larger product (which will later add AI pitch deck generation). Phase 1 must ship as a complete, standalone, production-usable product with authentication and an admin panel to manage scheme data.

## 3. Goals & Success Metrics

| Goal | Metric | Target (Phase 1 MVP) |
|---|---|---|
| Help founders find relevant schemes fast | Time from signup to first recommendation | < 3 minutes |
| Recommendation quality | Founder-reported relevance (thumbs up/down per scheme) | > 70% positive |
| Coverage | Number of active schemes in database | 20+ at launch |
| Reliability | Recommendation API success rate | > 99% (with LLM fallback) |
| Admin usability | Time for admin to add a new scheme | < 2 minutes |

## 4. Target Users / Personas

**Persona 1: Early-stage Founder ("Rohan")**
- Building a tech/agri/manufacturing startup, pre-revenue or early revenue
- Doesn't know which of the 100+ government schemes apply to him
- Wants a simple form, not a research project

**Persona 2: Founder from a special category ("Priya")**
- Woman-led or SC/ST/differently-abled founder
- Eligible for additional dedicated schemes but unaware they exist
- Needs the system to surface these proactively

**Persona 3: Platform Admin**
- Maintains the scheme database as government schemes change, expire, or launch
- Needs to add/edit/deactivate schemes without touching code
- Wants visibility into which schemes are being recommended/ignored

## 5. Scope (Phase 1)

### In Scope
- Founder registration/login (email + password)
- Multi-step founder questionnaire (business profile)
- AI + rule-based scheme recommendation engine
- Results page with match %, eligibility reasoning, application links
- Founder dashboard showing profile + past recommendation history
- Admin login (separate role, not publicly self-registered)
- Admin CRUD for schemes (add/edit/soft-delete)
- Admin analytics: user count, recommendation volume, top/zero-match schemes
- Seed database of 20+ real Indian government schemes

### Out of Scope (explicitly deferred)
- Pitch deck / PPT generation
- International or non-government (VC/private) funding schemes
- Payment or application-submission automation (we link out, not auto-apply)
- Mobile app (web-responsive only for now)
- Multi-language support (English only for MVP)

## 6. User Stories

**Founder**
1. As a founder, I can register and log in so my profile and results are saved.
2. As a founder, I can fill out a questionnaire about my business so the system understands my eligibility.
3. As a founder, I can view a ranked list of schemes with a plain-English explanation of why each one fits me.
4. As a founder, I can click through to the official scheme portal to apply.
5. As a founder, I can revisit my dashboard to see past recommendations without redoing the questionnaire.
6. As a founder, I can update my profile if my business stage/details change and get refreshed recommendations.

**Admin**
7. As an admin, I can log in through a separate, non-public route.
8. As an admin, I can add a new scheme with all eligibility details.
9. As an admin, I can edit or deactivate a scheme when it expires or changes.
10. As an admin, I can see which schemes are never recommended, so I can review their data quality.
11. As an admin, I can see overall platform usage (signups, recommendations run).

## 7. Functional Requirements

### 7.1 Authentication
- Email/password registration and login for founders
- Role-based access: `founder` and `admin`
- JWT-based session (short-lived access token + refresh token)
- Admin accounts are seeded/created manually, not via public signup
- Password reset flow (can be basic email-link based, or deferred to v1.1 — decide before build)

### 7.2 Founder Questionnaire
Required fields:
- Industry/sector
- Business stage: Idea / MVP / Early Revenue / Scaling
- State/location
- Team size
- Funding required (range)
- Business type: Tech / Manufacturing / Services / Agriculture / Other
- Special category flags: Woman-led, SC/ST founder, Differently-abled founder
- DPIIT registration status (Yes/No/Not sure)

### 7.3 Recommendation Engine
- Hard filter: remove schemes where founder fails mandatory eligibility (wrong state, inactive, wrong sector)
- Scoring: weighted match on sector, stage, funding range, special-category bonus
- AI explanation: short natural-language reasoning per recommended scheme
- Fallback: if AI call fails, show rule-based score + templated explanation (never block the user from getting results)
- Output: top 5–7 schemes, sorted by match strength

### 7.4 Results & Dashboard
- Scheme cards: name, issuing body, funding amount/type, match %, "why this fits you," apply link, deadline (if any)
- Sort/filter by funding amount, sector, deadline
- History view of past recommendation runs

### 7.5 Admin Panel
- Scheme CRUD (create, read, update, soft-delete)
- Scheme list with search/filter (by state, sector, status)
- Read-only user list (no password data ever exposed)
- Basic analytics dashboard

## 8. Non-Functional Requirements

- **Security:** hashed passwords (bcrypt), JWT secrets in env vars, input validation/sanitization on all endpoints, rate-limiting on auth routes
- **Performance:** recommendation response under 5 seconds (including AI call)
- **Reliability:** graceful degradation if the LLM API is down
- **Data integrity:** schemes are soft-deleted, never hard-deleted, to preserve recommendation history accuracy
- **Accessibility:** basic WCAG-friendly form design (labels, contrast, keyboard navigation)
- **Responsiveness:** usable on mobile and desktop browsers

## 9. Assumptions & Constraints

- Scheme data is manually curated/seeded initially; no live government API integration in Phase 1
- LLM API usage costs are acceptable for MVP scale; caching/rate-limiting can be added later
- English-only content for MVP
- No payment gateway needed in this phase

## 10. Open Questions (resolve before/at build start)

- Do we need email verification at signup, or is email+password sufficient for MVP?
- Should founders be able to save multiple business profiles (e.g., serial entrepreneurs)?
- Do we want founder feedback (thumbs up/down) on recommendations in v1, or defer to v1.1?
- Which database hosting (MongoDB Atlas vs self-hosted) for launch?

## 11. Release Plan

| Milestone | Deliverable |
|---|---|
| M1 | Auth (founder + admin) working end-to-end |
| M2 | Questionnaire + profile storage working |
| M3 | Recommendation engine (rule-based + AI) returning results |
| M4 | Admin panel CRUD + analytics |
| M5 | Seed data (20+ schemes), polish, QA pass |
| M6 | Deploy MVP |

## 12. Future Phases (not part of this build)

- Phase 2: AI pitch deck generator using the same founder profile
- Phase 3: State-scheme deep coverage, application status tracking
- Phase 4: Multi-language support, mobile app
