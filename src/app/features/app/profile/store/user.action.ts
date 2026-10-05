import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ClearSession, SessionsData, UpdatePasswordDto } from '../interfaces';
import { UserProfile } from '@/features/auth/response';
import { CVResponse } from '../interfaces/cv.interface';

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

    //CV
    'Get CV': emptyProps(),
    'Get Olds CV': emptyProps(),
    'Upload CV': props<{ data: FormData }>(),
    'Download CV': emptyProps(),

    // Success
    'Get User Success': props<{ data: UserProfile }>(),
    'Update Profile Success': emptyProps(),
    'Update Password Success': emptyProps(),
    'Get All Sesions Success': props<{ data: SessionsData[] }>(),
    'Delete Session By ID Success': props<{ sessionId: string; data: ClearSession }>(),
    'Delete All Sesions Success': props<{ data: ClearSession }>(),

    // Success CV
    'Get CV Success': props<{ data: CVResponse }>(),
    'Get Olds CV Success': props<{ data: CVResponse[] }>(),
    'Upload CV Success': props<{ data: string }>(),
    'Download CV Success': props<{ filename: string }>(),

    // Failure
    'Get User Failure': props<{ error: string; statusCode: number }>(),
    'Update Profile Failure': props<{ error: string; statusCode: number }>(),
    'Update Password Failure': props<{ error: string; statusCode: number }>(),
    'Get All Sesions Failure': props<{ error: string; statusCode: number }>(),
    'Delete Session By ID Failure': props<{ error: string; statusCode: number }>(),
    'Delete All Sesions Failure': props<{ error: string; statusCode: number }>(),

    // Failure CV
    'Get CV Failure': props<{ error: string; statusCode: number }>(),
    'Get Olds CV Failure': props<{ error: string; statusCode: number }>(),
    'Upload CV Failure': props<{ error: string; statusCode: number }>(),
    'Download CV Failure': props<{ error: string; statusCode: number }>(),

    // Misc
    'Clear Error': emptyProps(),
  },
});
