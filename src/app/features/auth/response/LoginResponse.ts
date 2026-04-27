import { ApiResponse } from '@/shared/response';
import { UserProfile } from './ProfileResponse';

interface Data {
  user: UserProfile;
  access_token: string;
  refresh_token: string;
}

export type LoginResponse = ApiResponse<Data>;
