# Learnings

Corrections, insights, and knowledge gaps captured during development.

**Categories**: correction | insight | knowledge_gap | best_practice

---

## [LRN-20260603-001] correction

**Logged**: 2026-06-03T17:10:00Z
**Priority**: high
**Status**: resolved
**Area**: backend

### Summary
Verification email links showing "Invalid url" - APP_URL environment variable was defaulting to localhost:3000 in production

### Details
The send-verification API route was using `process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'` as the fallback. In production, when the env var wasn't set, emails contained localhost links instead of the production domain.

### Suggested Action
Always use production domain as the fallback for server-side API routes that generate URLs for external use (emails, share links, etc.)

### Resolution
- **Resolved**: 2026-06-03T17:15:00Z
- **Commit**: 17cf071
- **Notes**: Changed fallback from 'http://localhost:3000' to 'https://tubefission.com'

### Metadata
- Source: user_feedback
- Related Files: app/api/auth/send-verification/route.ts
- Tags: email, verification, env-vars, production

---

## [LRN-20260603-002] best_practice

**Logged**: 2026-06-03T17:00:00Z
**Priority**: medium
**Status**: resolved
**Area**: backend

### Summary
Use crypto.randomBytes instead of Math.random for generating secure tokens

### Details
Math.random().toString(36) can produce inconsistent token formats and potentially problematic characters for URL usage. The crypto module provides cryptographically secure random bytes that convert cleanly to hex.

### Suggested Action
For URL-safe tokens:
- Use `crypto.randomBytes(16).toString('hex')` for 32-char tokens
- Or `crypto.randomBytes(32).toString('hex')` for 64-char tokens
- Avoid Math.random for any security-sensitive token generation

### Resolution
- **Resolved**: 2026-06-03T17:00:00Z
- **Commit**: 17cf071
- **Notes**: Changed from Math.random() to crypto.randomBytes(16).toString('hex')

### Metadata
- Source: error
- Related Files: app/api/auth/send-verification/route.ts
- Tags: security, tokens, crypto, best-practice
- Pattern-Key: security.token_generation
- Recurrence-Count: 1

---
