// Minimal auth helpers (hashing) - for production use bcrypt and proper practices
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hashed: string) {
  return hashPassword(password) === hashed;
}

// Very small HMAC token (not a real JWT); suitable for dev/demo only.
export function signToken(payload: object, expiresInSeconds = 60 * 60 * 24) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const toSign = `${header}.${body}`;
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(toSign).digest('base64url');
  return `${toSign}.${sig}`;
}

export function verifyToken(token: string) {
  try {
    const [headerB, bodyB, sig] = token.split('.');
    const toSign = `${headerB}.${bodyB}`;
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(toSign).digest('base64url');
    if (expected !== sig) return null;
    const payload = JSON.parse(Buffer.from(bodyB, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (e) {
    return null;
  }
}
