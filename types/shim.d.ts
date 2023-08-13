import { JWTPayload } from 'jose';
import { Role } from '@/types/user';

declare module 'jose' {
  interface JWTPayload {
    id: string;
    role?: Role;
    name?: string;
  }
}

declare module 'h3' {
  interface H3EventContext {
    payload: JWTPayload | null;
    error: Error | null;
  }
}

export default {};
