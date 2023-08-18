import { S3Client } from '@aws-sdk/client-s3';
import { JWTPayload } from 'jose';
import { Role } from '@/types/user';
import { OpenAIApi } from 'openai';

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

declare module 'nitropack' {
  interface NitroApp {
    openai: OpenAIApi;
    s3: S3Client;
  }
}

export default {};
