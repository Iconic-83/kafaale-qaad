import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Express 5 types params as Record<string, string | string[]>.
// We override params to string-only for cleaner route code.
export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
  params: Record<string, string>;
  file?: any;
  files?: any;
}

// In-memory token blacklist — supports server-side logout / forced invalidation.
// Cleared on restart (acceptable: tokens expire in 7d anyway, and restart is rare in prod).
// Key = raw JWT string; value = expiry timestamp so we can evict stale entries.
export const tokenBlacklist = new Map<string, number>();

// Evict expired entries every 30 minutes so the map doesn't grow unboundedly.
setInterval(() => {
  const now = Date.now();
  for (const [token, exp] of tokenBlacklist) {
    if (exp < now) tokenBlacklist.delete(token);
  }
}, 30 * 60 * 1000);

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
  try {
    const token = header.split(' ')[1];
    if (!token || token.length < 20) return res.status(401).json({ error: 'Invalid token format' });

    // Reject blacklisted tokens (server-side logout)
    if (tokenBlacklist.has(token)) return res.status(401).json({ error: 'Session has been revoked — please log in again', code: 'TOKEN_REVOKED' });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string; email: string; exp?: number };
    req.user = payload;
    next();
  } catch (err: any) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Session expired — please log in again'
      : 'Authentication failed';
    res.status(401).json({ error: msg });
  }
}

export function requireRole(roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: 'Insufficient permissions' });
    next();
  };
}
