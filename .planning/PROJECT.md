# Tegra Social

## What This Is

An internal culture platform for Roanuz that connects the India (Chennai) and Iceland (Reykjavik) teams beyond project work. It gives every employee — not just project collaborators — shared rituals, challenges, and social moments that build trust and belonging across 4,500+ km. Built around six engagement pillars: Team Profiles, Sports & Fitness Challenges, Win Announcements, Random Coffee, Social Feed, and Cultural Trivia.

## Core Value

Every Roanuz employee has a low-effort, structured reason to connect with someone from the other country every week — without needing a shared project or a common language beyond English.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Invite-only authentication with admin-generated codes
- [ ] Team profiles with name, role, country, interests, fun fact, photo
- [ ] CSV import to seed employee data (name, role, country)
- [ ] Sports & fitness challenges with step/distance tracking (manual entry)
- [ ] Weekly/monthly leaderboards with India vs Iceland team mode
- [ ] Win announcements board with emoji reactions
- [ ] Random Coffee auto-matching (India ↔ Iceland pairing)
- [ ] Slot selection within 7-day window for coffee meets
- [ ] Icebreaker prompts before meetings
- [ ] Post-meet feedback (2 questions)
- [ ] Social feed with photo/text posts and emoji reactions
- [ ] Cultural trivia — weekly India vs Iceland questions
- [ ] Admin moderation for social feed posts
- [ ] Responsive web app (desktop-first, mobile-responsive)

### Out of Scope

- Google Workspace SSO — mocked/stubbed for V1, connect when credentials available
- Google Calendar/Meet integration — stubbed, manual Meet links for V1
- Icelandic localization / i18n — English only for V1
- Translation API for trivia — English only
- Native mobile apps (iOS/Android) — web-first
- Direct messaging — Slack/Teams already serve this
- Comment threads on posts — emoji reactions only, avoids moderation complexity
- Gamification (streaks, badges, XP) — risks shifting focus from community
- Fitness wearable integration — manual entry sufficient
- Video message exchange — infrastructure cost not justified
- Manager recognition badges — Win Announcements sufficient
- Slack/Teams bot notifications — V2
- Interest Clubs — P2, defer to post-MVP

## Context

- **Company:** Roanuz — dev team in Chennai (India), client-facing team in Reykjavik (Iceland)
- **Existing tools:** India uses Slack, Iceland uses Microsoft Teams — no shared non-work channel
- **8H Delivery Unit:** The cross-country project team that already collaborates daily — these are the early adopters and internal champions
- **Employee count:** Platform should support up to 500 users
- **Key adoption risk:** Platform fatigue — "yet another tool." Mitigated by invite-only rollout and leadership seeding engagement first
- **Cultural context:** English bridges work but casual connection requires confidence most lack in a second language. Numbers (step counts, scores) and visual content (photos, reactions) are language-agnostic engagement drivers
- **Ship target:** Working demo — functional enough to walk leadership through in a meeting, not production-hardened
- **Builder:** Solo developer + Claude — timeline and scope calibrated accordingly

## Constraints

- **Auth:** Invite-only codes for V1 — no public signup, no SSO yet
- **Google APIs:** All Google integrations (SSO, Calendar, Meet) are mocked/stubbed — build the flows, connect later when Workspace admin access is available
- **Employee data:** CSV import for seeding profiles — no live HRIS integration
- **Language:** English only — no i18n infrastructure needed in V1
- **Timeline:** ASAP — working demo as fast as possible
- **Team:** Solo build — scope phases for one developer
- **Platform:** Web only (responsive) — no native mobile

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Invite-only auth over SSO | Google Workspace admin access not yet available; invite codes are simpler and control rollout | — Pending |
| Mock Google integrations | Unblocks development; real integrations added when credentials available | — Pending |
| English only for V1 | Ships faster; Icelandic localization adds scope without validating core engagement hypothesis | — Pending |
| CSV import over HRIS | No HRIS API access; CSV is sufficient for seeding 100-500 profiles | — Pending |
| All 6 features in V1 | User wants full feature coverage for leadership demo | — Pending |
| Working demo as ship target | Validate concept with leadership before investing in production hardening | — Pending |
| Solo + Claude build | Team from PRD not yet allocated; solo build shapes realistic scope | — Pending |

---
*Last updated: 2026-03-22 after initialization*
