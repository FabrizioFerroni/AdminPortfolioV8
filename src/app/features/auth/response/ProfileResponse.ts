import { ApiResponse } from '@/shared/response';

export interface UserProfile {
  id: string;
  name: string;
  lastname: string;
  email: string;
  avatar: string | null;
}

export type ProfileResponse = ApiResponse<UserProfile>;
