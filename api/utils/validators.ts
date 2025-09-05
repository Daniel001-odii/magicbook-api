import { User } from '../models/user';

export function validateUser(input: any): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  if (!input) return { valid: false, errors: ['No input'] };
  if (!input.username) errors.push('username is required');
  if (!input.email) errors.push('email is required');
  if (!input.password) errors.push('password is required');
  return { valid: errors.length === 0, errors };
}

export function validateQRCode(input: any) {
  const errors: string[] = [];
  if (!input) return { valid: false, errors: ['No input'] };
  if (!input.uid) errors.push('uid is required');
  if (!input.owner) errors.push('owner is required');
  return { valid: errors.length === 0, errors };
}
