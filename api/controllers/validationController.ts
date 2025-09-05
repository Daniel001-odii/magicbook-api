import { Request, Response, NextFunction } from 'express';
import { validateUser, validateQRCode } from '../utils/validators';

export function validateCreateUser(req: Request, res: Response, next: NextFunction) {
  const { valid, errors } = validateUser(req.body);
  if (!valid) return res.status(400).json({ errors });
  next();
}

export function validateCreateQRCode(req: Request, res: Response, next: NextFunction) {
  const { valid, errors } = validateQRCode(req.body);
  if (!valid) return res.status(400).json({ errors });
  next();
}
