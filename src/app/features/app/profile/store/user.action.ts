import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UpdatePasswordDto } from '../interfaces';
import { UserProfile } from '@/features/auth/response';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    // Triggers
    'Get User': emptyProps(),
    'Update Profile': props<{ data: FormData }>(),
    'Update Password': props<{ data: UpdatePasswordDto }>(),

    // Success
    'Get User Success': props<{ data: UserProfile }>(),
    'Update Profile Success': emptyProps(),
    'Update Password Success': emptyProps(),

    // Failure
    'Get User Failure': props<{ error: string; statusCode: number }>(),
    'Update Profile Failure': props<{ error: string; statusCode: number }>(),
    'Update Password Failure': props<{ error: string; statusCode: number }>(),

    // Misc
    'Clear Error': emptyProps(),
  },
});
