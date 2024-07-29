import { randomBytes } from 'crypto';

export function generateRandomPassword(length: number = 12): string {
  return randomBytes(length).toString('hex').slice(0, length);
}