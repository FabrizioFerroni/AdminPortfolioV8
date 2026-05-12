import { UserProfile } from '@/features/auth/response';

export interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  formProfileError: string | null;
  formPasswordError: string | null;
  formProfileStatusCode: number | null;
  formPasswordStatusCode: number | null;
  isLoadingProfileForm: boolean;
  isLoadingPasswordForm: boolean;
}

export interface UserData {
  user: UserProfile;
}
