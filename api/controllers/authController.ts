import { Request, Response, NextFunction } from 'express';
import { getUserByEmail } from '../services/userService';
import { verifyPassword, signToken } from '../services/authService';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    if (!verifyPassword(password, user.password)) return res.status(401).json({ error: 'invalid credentials' });

    const token = signToken({ sub: user.id, email: user.email });
    // Do not return password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...safe } = user as any;
    res.json({ user: safe, token });
  } catch (err) {
    next(err);
  }
}

export default {};
