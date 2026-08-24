import { UserProfile } from '@/features/auth/response';
import { ClearSession, SessionsData } from './session.interface';

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

  // sessionss
  isLoadingSessions: boolean;
  sessions: SessionsData[] | null;
  errorSessions: string | null;
  statusCodeSessions: number | null;

  //delete session id
  isLoadingDeleteIdSession: boolean;
  deleteIdSession: ClearSession | null;
  errorIdSession: string | null;
  statusCodeIdSession: number | null;

  //delete session all
  isLoadingDeleteAllSession: boolean;
  deleteAllSession: ClearSession | null;
  errorAllSession: string | null;
  statusCodeAllSession: number | null;
}

export interface UserData {
  user: UserProfile;
}
