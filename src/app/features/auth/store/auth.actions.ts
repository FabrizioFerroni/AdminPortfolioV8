import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IChangePassword, IForgotPassword, ILogin } from '../interfaces';
import { UserProfile } from '../response';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ body: ILogin; rememberMe: boolean }>(),
    ForgotPassword: props<{ body: IForgotPassword }>(),
    ChangePassword: props<{ body: IChangePassword }>(),
    VerifyTokenPassword: props<{ token: string }>(),
    'Login Success': props<{
      user: UserProfile;
      access_token: string;
      rememberMe: boolean;
    }>(),
    'ForgotPassword Success': props<{ message: string }>(),
    'ChangePassword Success': props<{ message: string }>(),
    'VerifyTokenPassword Success': props<{ message: string }>(),
    'Login Failure': props<{ error: string; statusCode: number }>(),
    'ForgotPassword Failure': props<{ error: string; statusCode: number }>(),
    'ChangePassword Failure': props<{ error: string; statusCode: number }>(),
    'VerifyTokenPassword Failure': props<{ error: string; statusCode: number }>(),
    Logout: emptyProps(),
    'Update User': props<{ user: Partial<UserProfile> }>(),
    'Clear Error': emptyProps(),
    Init: emptyProps(),
    Hydrate: props<{ user: UserProfile }>(),
    'Clear Forgot Message': emptyProps(),
  },
});
