import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';
import { getUserById } from '../services/userService';

export async function authMiddleware (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
  }

  const token = authHeader.substring(7); // "Bearer ".length

  try {
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // The token payload has `sub` as the user id
    const userId = payload.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error in requireAuth middleware:', error);
    if (error instanceof Error) {
      return res.status(401).json({ error: `Unauthorized: ${error.message}` });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}