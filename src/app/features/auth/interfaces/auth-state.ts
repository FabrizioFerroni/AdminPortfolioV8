import { UserProfile } from '../response';

export interface AuthState {
  user: UserProfile | null;
  isLogged: boolean;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;

  //forgot password
  messageForgot: string | null;
  isLoadingForgot: boolean;
  errorForgot: string | null;
  statusCodeForgot: number | null;

  //verify password
  verifyPassword: string | null;
  isLoadingVerify: boolean;
  errorVerify: string | null;
  statusCodeVerify: number | null;

  //change password
  resultChangePassword: string | null;
  isLoadingChangePassword: boolean;
  errorChangePassword: string | null;
  statusCodeChangePassword: number | null;
}
