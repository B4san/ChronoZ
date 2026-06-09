# Chronos Engine — Security & Authentication

**Version:** 1.0  
**Date:** June 9, 2026

---

## 1. Authentication

### 1.1 Strategy

- **NextAuth.js v5** con providers:
  - Email/Password (credentials)
  - Google OAuth
  - GitHub OAuth
- JWT tokens para API authentication
- HttpOnly cookies para web sessions

### 1.2 User Model

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  tier: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  lastLoginAt: Date;
}
```

### 1.3 Session Strategy

```typescript
// next-auth config
export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate credentials against DB
        // Return user object or null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tier = user.tier;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.tier = token.tier;
      return session;
    }
  }
};
```

---

## 2. API Security

### 2.1 Rate Limiting

| Endpoint Type | Rate Limit | Window |
|---|---|---|
| Auth endpoints | 5 req/min | 1 min |
| Read endpoints | 100 req/min | 1 min |
| Create timeline | 10 req/hour | 1 hour |
| Simulation trigger | 5 req/hour | 1 hour |

### 2.2 Implementation

```typescript
// src/lib/security/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

export async function rateLimit(identifier: string) {
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);
  
  return {
    success,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    }
  };
}
```

### 2.3 Input Validation

```typescript
// Every API endpoint validates with Zod
import { z } from 'zod';

const CreateTimelineSchema = z.object({
  divergence: z.string()
    .min(10, "Divergence must be at least 10 characters")
    .max(500, "Divergence must be at most 500 characters")
    .regex(/^[a-zA-Z0-9\s,.\-!?]+$/, "Invalid characters in divergence"),
  options: z.object({
    maxYears: z.number().int().min(10).max(500).optional().default(100),
    detailLevel: z.enum(['minimal', 'standard', 'full']).optional().default('standard'),
  }).optional(),
});
```

---

## 3. Data Security

### 3.1 Secrets Management

| Secret | Storage | Rotation |
|---|---|---|
| Database credentials | Vercel Environment Variables | Quarterly |
| API keys (LLM) | Vercel Environment Variables | Monthly |
| NextAuth secret | Vercel Environment Variables | Quarterly |
| Redis credentials | Upstash Dashboard | Quarterly |

### 3.2 Data Encryption

- **In transit:** TLS 1.3 (enforced by Vercel)
- **At rest:** Neo4j Aura encryption, Upstash encryption
- **Passwords:** bcrypt with salt rounds = 12

### 3.3 Neo4j Security

```typescript
// Connection with TLS
const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!),
  {
    encrypted: 'ENCRYPTION_ON',
    trust: 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES',
  }
);
```

---

## 4. LLM Security

### 4.1 Prompt Injection Prevention

```typescript
// Sanitize user input before sending to LLM
function sanitizeForLLM(input: string): string {
  return input
    .replace(/[<>]/g, '')  // Remove angle brackets
    .replace(/system:/gi, '')  // Remove system: prefix attempts
    .replace(/assistant:/gi, '')  // Remove assistant: prefix attempts
    .trim()
    .slice(0, 500);  // Limit length
}
```

### 4.2 Output Validation

```typescript
// Always validate LLM output against Zod schema
function validateLLMOutput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`LLM output validation failed: ${result.error.message}`);
  }
  return result.data;
}
```

### 4.3 Content Filtering

- Filter LLM outputs for:
  - Personal identifiable information (PII)
  - Harmful content
  - Hallucinated real-world entities
  - Inappropriate content

---

## 5. CORS Configuration

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGIN! },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ];
  },
};
```

---

## 6. Content Security Policy

```typescript
// next.config.ts
const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://*.databases.neo4j.io https://*.upstash.io;
  media-src 'self';
  object-src 'none';
  frame-ancestors 'none';
`;
```

---

## 7. Audit Logging

```typescript
// Log security-relevant events
interface AuditLog {
  timestamp: Date;
  userId: string;
  action: 'login' | 'logout' | 'create_timeline' | 'delete_timeline' | 'api_key_used';
  resource?: string;
  ip: string;
  userAgent: string;
  success: boolean;
}
```

---

## 8. Compliance Considerations

| Requirement | Status | Notes |
|---|---|---|
| GDPR | Required | User data deletion, export |
| CCPA | Required | California privacy rights |
| SOC 2 | Future | When scaling to enterprise |
| OWASP Top 10 | Addressed | See sections above |
