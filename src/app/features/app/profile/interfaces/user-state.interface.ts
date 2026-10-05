import { UserProfile } from '@/features/auth/response';
import { ClearSession, SessionsData } from './session.interface';
import { CVResponse } from './cv.interface';

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

  //get cv
  isLoadingGetCv: boolean;
  getCV: CVResponse | null;
  errorGetCv: string | null;
  statusCodeGetCV: number | null;

  // Upload cv
  isLoadingUploadCV: boolean;
  uploadCV: string | null;
  errorUploadCv: string | null;
  statusCodeUploadCV: number | null;

  // Download CV
  isLoadingDownloadCV: boolean;
  downloadCV: string | null;
  errorDownloadCV: string | null;
  statusCodeDownloadCV: number | null;

  //get old cv
  isLoadingGetOldsCvs: boolean;
  getOldsCVS: CVResponse[] | null;
  errorGetOldsCvs: string | null;
  statusCodeGetOldsCVS: number | null;
}

export interface UserData {
  user: UserProfile;
}
