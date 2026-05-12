import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SettingList, UpdateSettingDto } from '../interfaces';

export const SettingActions = createActionGroup({
  source: 'Setting',
  events: {
    // Triggers
    'Get Setting': emptyProps(),
    'Update Setting': props<{ data: UpdateSettingDto }>(),

    // Success
    'Get Setting Success': props<{ data: SettingList }>(),
    'Update Setting Success': emptyProps(),

    // Failure
    'Get Setting Failure': props<{ error: string; statusCode: number }>(),
    'Update Setting Failure': props<{ error: string; statusCode: number }>(),

    // Misc
    'Clear Error': emptyProps(),
  },
});
