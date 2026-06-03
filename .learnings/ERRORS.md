# Errors

Command failures and integration errors.

---

## [ERR-20260603-001] git_push

**Logged**: 2026-06-03T17:20:00Z
**Priority**: medium
**Status**: intermittent
**Area**: infra

### Summary
Repeated GitHub HTTPS push failures with "Failed to connect to github.com port 443" and "Empty reply from server"

### Error
```
fatal: unable to access 'https://github.com/tossandturn/trendtube.git/': 
Failed to connect to github.com port 443 after 21100ms: Could not connect to server

fatal: unable to access 'https://github.com/tossandturn/trendtube.git/': 
Recv failure: Connection was reset

fatal: unable to access 'https://github.com/tossandturn/trendtube.git/': 
Empty reply from server
```

### Context
- Multiple retry attempts with 5-20 second delays
- Eventually succeeded after ~15 attempts
- Network connectivity to github.com was confirmed via ping (76ms latency)
- Issue appears to be intermittent network/routing problem

### Suggested Fix
Consider using SSH instead of HTTPS for GitHub operations to avoid potential HTTPS proxy/routing issues

### Metadata
- Reproducible: intermittent
- Related Files: N/A

---

## [ERR-20260603-002] resend_api

**Logged**: 2026-06-03T16:45:00Z
**Priority**: high
**Status**: resolved
**Area**: backend

### Summary
Resend API rejecting verification emails with "Invalid url" error (ret: -5002, cgi: xmspamchecklogicsvr/xmsafejump)

### Error
```json
{"head":{"ret":-5002,"cgi":"xmspamchecklogicsvr/xmsafejump","time":1780476783,"msg":"","stack":"Invalid url"}}
```

### Context
- HTML email with styled verification button was being flagged by Resend's spam filter
- Token was 64 characters (32 bytes hex) which created longer URLs
- Suspicion: either URL length or HTML email structure triggered the filter

### Suggested Fix
1. Use text-only email format (simpler, less likely to trigger spam filters)
2. Shorten token from 64 chars to 32 chars (16 bytes hex)
3. Avoid complex HTML email templates with inline styles for transactional emails

### Resolution
- **Resolved**: 2026-06-03T17:00:00Z
- **Commit**: 17cf071
- **Notes**: Switched to text-only email with 32-char token, then re-added HTML as multipart with proper email table layout

### Metadata
- Reproducible: yes (before fix)
- Related Files: app/api/auth/send-verification/route.ts
- Tags: email, resend, spam-filter, api-error

---
