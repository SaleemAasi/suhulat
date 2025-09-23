// utils/auth.ts
import { jwtDecode } from 'jwt-decode';

export function isTokenValid(token: string) {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
