import { describe, it, expect } from 'vitest';
import { app } from '../../api/index';
import {
  createSessionToken,
  verifySessionToken,
  createOAuthState,
  verifyOAuthState,
  escapeHtml,
  SessionUser
} from '../../api/session';
import { generateInitialsAvatar } from '../../src/utils/avatar';
import { importDesignTokensFromJson, TokenMigrationError } from '../../src/tokens/migration';
import { DEFAULT_DESIGN_TOKENS } from '../../src/tokens/defaultTokens';
import { DesignTokensSchema } from '../../src/tokens/types';

describe('Security, QA & Health Architecture (Doc 05 §2 & §5 & 01_SECURITY_AND_BACKEND)', () => {
  it('serves /health and /healthz with valid status, version, and headers', async () => {
    const res = await new Promise<{ status: number; headers: Record<string, string>; body: any }>((resolve) => {
      const mockReq = {
        method: 'GET',
        url: '/healthz',
        path: '/healthz',
        headers: {},
        socket: { remoteAddress: '127.0.0.1' }
      } as any;

      const headers: Record<string, string> = {};
      let statusCode = 200;

      const mockRes = {
        setHeader(name: string, value: string) {
          headers[name.toLowerCase()] = value;
          return this;
        },
        status(code: number) {
          statusCode = code;
          return this;
        },
        json(data: any) {
          resolve({ status: statusCode, headers, body: data });
        }
      } as any;

      app(mockReq, mockRes);
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.version).toBe('1.6.0');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(res.headers['content-security-policy']).toContain("default-src 'self'");
    expect(res.headers['content-security-policy']).toContain('https://fonts.googleapis.com');
  });

  it('generates and verifies per-user stateless signed session tokens (S2)', () => {
    const userA: SessionUser = {
      id: 'usr_alice',
      name: 'Alice Designer',
      email: 'alice@example.com',
      avatar: 'data:image/svg+xml;utf8,...',
      provider: 'google',
      authenticatedAt: Date.now()
    };

    const userB: SessionUser = {
      id: 'usr_bob',
      name: 'Bob Founder',
      email: 'bob@example.com',
      avatar: 'data:image/svg+xml;utf8,...',
      provider: 'google',
      authenticatedAt: Date.now()
    };

    const tokenA = createSessionToken(userA);
    const tokenB = createSessionToken(userB);

    expect(tokenA).not.toBe(tokenB);

    const verifiedA = verifySessionToken(tokenA);
    const verifiedB = verifySessionToken(tokenB);

    expect(verifiedA?.email).toBe('alice@example.com');
    expect(verifiedB?.email).toBe('bob@example.com');
    expect(verifiedA?.id).toBe('usr_alice');
    expect(verifiedB?.id).toBe('usr_bob');
  });

  it('rejects tampered session tokens with invalid signatures (S2)', () => {
    const validUser: SessionUser = {
      id: 'usr_charlie',
      name: 'Charlie',
      email: 'charlie@example.com',
      avatar: 'avatar.png',
      provider: 'google',
      authenticatedAt: Date.now()
    };

    const token = createSessionToken(validUser);
    const [payload, sig] = token.split('.');

    // Tamper with payload
    const tamperedPayload = Buffer.from(
      JSON.stringify({ ...validUser, email: 'hacker@attacker.com' })
    ).toString('base64url');

    const tamperedToken = `${tamperedPayload}.${sig}`;
    expect(verifySessionToken(tamperedToken)).toBeNull();

    // Tamper with signature
    const badSigToken = `${payload}.invalid_signature_string`;
    expect(verifySessionToken(badSigToken)).toBeNull();
  });

  it('creates cryptographically random OAuth state with PKCE and verifies CSRF (S5)', () => {
    const { state, codeChallenge, cookieValue } = createOAuthState('google', 'http://localhost:3000');
    expect(state).toBeDefined();
    expect(codeChallenge).toBeDefined();
    expect(cookieValue).toBeDefined();

    // Valid state verification
    const verified = verifyOAuthState(cookieValue, state);
    expect(verified).not.toBeNull();
    expect(verified?.state).toBe(state);
    expect(verified?.provider).toBe('google');
    expect(verified?.targetOrigin).toBe('http://localhost:3000');
    expect(verified?.codeVerifier).toBeDefined();

    // Attacker sends mismatched or empty state (CSRF attack)
    expect(verifyOAuthState(cookieValue, 'attacker_forged_state')).toBeNull();
    expect(verifyOAuthState(cookieValue, '')).toBeNull();
  });

  it('escapes HTML strings against reflected XSS in OAuth callback (S6)', () => {
    const maliciousScript = '<script>alert("xss")</script>';
    const escaped = escapeHtml(maliciousScript);
    expect(escaped).not.toContain('<script>');
    expect(escaped).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');

    const imgPayload = '<img src=x onerror=alert(1)>';
    const escapedImg = escapeHtml(imgPayload);
    expect(escapedImg).not.toContain('<img');
    expect(escapedImg).toBe('&lt;img src=x onerror=alert(1)&gt;');
  });

  it('generates local SVG initials avatar without DiceBear or email leakage (S11)', () => {
    const avatar = generateInitialsAvatar('Design Leader');
    expect(avatar).toContain('data:image/svg+xml;utf8');
    expect(avatar).toContain('DL');
    expect(avatar).not.toContain('dicebear.com');
  });

  it('rejects oversized JSON payloads (> 2 MB) to prevent DoS attacks', () => {
    const hugePayload = 'b'.repeat(2 * 1024 * 1024 + 10);
    expect(() => importDesignTokensFromJson(hugePayload)).toThrow(TokenMigrationError);
    expect(() => importDesignTokensFromJson(hugePayload)).toThrow('File payload exceeds maximum limit of 2 MB.');
  });

  it('strictly validates imported project JSON against Zod schema without eval injection', () => {
    const maliciousJson = JSON.stringify({
      schemaVersion: 1,
      meta: {
        projectName: '<script>alert("xss")</script>',
        slug: 'test',
        genreId: 'ceramics-atelier',
        category: 'commerce',
        personality: { energy: 50, craft: 50, voice: 50, formality: 50, density: 50 }
      },
      color: 'INVALID_COLOR_STRUCTURE'
    });

    const sanitized = importDesignTokensFromJson(maliciousJson);
    expect(sanitized.schemaVersion).toBe(1);
    expect(sanitized.color.primitives).toBeDefined();
    expect(sanitized.color.primitives.brand).toBeDefined();
    expect(DesignTokensSchema.safeParse(sanitized).success).toBe(true);
  });

  it('ensures no unvetted secrets or client keys are exposed in token exports', () => {
    const sample = JSON.stringify(DEFAULT_DESIGN_TOKENS);
    expect(sample).not.toContain('GOOGLE_CLIENT_SECRET');
    expect(sample).not.toContain('GOOGLE_FONTS_API_KEY');
    expect(sample).not.toContain('CLIENT_SECRET');
  });
});
