import { UserProfile } from '@/features/auth/response';

export interface ClearSession {
  succes: boolean;
  message: string;
}

export type SessionDevice = 'desktop' | 'mobile' | 'tablet';

export interface SessionsData {
  id: string;
  ip: string;
  city?: string;
  country?: string;
  deviceName: string;
  deviceType: SessionDevice;
  browser: string;
  os: string;
  remembered: boolean;
  createdAt: Date;
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  revokedAt: Date | null;
  user: UserProfile;
  current: boolean;
}
