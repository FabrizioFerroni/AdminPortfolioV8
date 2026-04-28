import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ILogin } from '../interfaces';
import { UserProfile } from '../response';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ body: ILogin; rememberMe: boolean }>(),
    'Login Success': props<{
      user: UserProfile;
      access_token: string;
      refresh_token: string;
      rememberMe: boolean;
    }>(),
    'Login Failure': props<{ error: string; statusCode: number }>(),
    Logout: emptyProps(),
    'Update User': props<{ user: Partial<UserProfile> }>(),
    'Clear Error': emptyProps(),
    Init: emptyProps(),
    Hydrate: props<{ user: UserProfile }>(),
  },
});
