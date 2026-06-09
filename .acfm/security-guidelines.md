# Chronos Engine — Security Guidelines

**Version:** 1.0  
**Date:** June 9, 2026

---

## OWASP Top 10 Mitigations

| Risk | Mitigation |
|---|---|
| A01: Broken Access Control | NextAuth.js session validation on all protected routes |
| A02: Cryptographic Failures | TLS 1.3 enforced, bcrypt for passwords, no secrets in code |
| A03: Injection | Zod validation on all inputs, parameterized Neo4j queries |
| A04: Insecure Design | Threat modeling during design phase, security review before merge |
| A05: Security Misconfiguration | Environment variables for all secrets, CSP headers enabled |
| A06: Vulnerable Components | npm audit in CI, Dependabot enabled |
| A07: Auth Failures | Rate limiting on auth endpoints, secure session management |
| A08: Data Integrity | Input validation, output encoding, CSRF protection |
| A09: Logging Failures | Structured logging, security event audit trail |
| A10: SSRF | No user-controlled URLs in server-side requests |

---

## LLM-Specific Security

1. **Prompt Injection:** Sanitize all user input before sending to LLM
2. **Output Validation:** Always validate LLM output against Zod schema
3. **Content Filtering:** Filter PII, harmful content, and real-world entity hallucinations
4. **Token Limits:** Enforce max token limits to prevent abuse
5. **Cost Controls:** Per-user budget caps, circuit breaker on providers

---

## Secrets Management

- Use Vercel Environment Variables for all secrets
- Never log secrets or API keys
- Rotate keys quarterly
- Use different keys for dev/staging/production
