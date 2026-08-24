import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ClearSession, SessionsData, UpdatePasswordDto } from '../interfaces';
import { UserProfile } from '@/features/auth/response';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    // Triggers
    'Get User': emptyProps(),
    'Update Profile': props<{ data: FormData }>(),
    'Update Password': props<{ data: UpdatePasswordDto }>(),
    'Get All Sesions': emptyProps(),
    'Delete Session By ID': props<{ sessionId: string }>(),
    'Delete All Sesions': emptyProps(),

    // Success
    'Get User Success': props<{ data: UserProfile }>(),
    'Update Profile Success': emptyProps(),
    'Update Password Success': emptyProps(),
    'Get All Sesions Success': props<{ data: SessionsData[] }>(),
    'Delete Session By ID Success': props<{ sessionId: string; data: ClearSession }>(),
    'Delete All Sesions Success': props<{ data: ClearSession }>(),

    // Failure
    'Get User Failure': props<{ error: string; statusCode: number }>(),
    'Update Profile Failure': props<{ error: string; statusCode: number }>(),
    'Update Password Failure': props<{ error: string; statusCode: number }>(),
    'Get All Sesions Failure': props<{ error: string; statusCode: number }>(),
    'Delete Session By ID Failure': props<{ error: string; statusCode: number }>(),
    'Delete All Sesions Failure': props<{ error: string; statusCode: number }>(),

    // Misc
    'Clear Error': emptyProps(),
  },
});
