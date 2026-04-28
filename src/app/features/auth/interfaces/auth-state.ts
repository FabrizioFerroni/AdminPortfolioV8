import { UserProfile } from '../response';

export interface AuthState {
  user: UserProfile | null;
  isLogged: boolean;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
}
