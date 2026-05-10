import { PaginacionQuery } from '@/shared/interfaces';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateExperienceDto,
  ExperienceCount,
  ExperienceList,
  UpdateExperienceDto,
} from '../interfaces';
import { ExperienceData } from '../interfaces/experience-state.interface';

export const ExperiencesActions = createActionGroup({
  source: 'Experiences',
  events: {
    // Triggers
    'Get All': props<{ paginado: PaginacionQuery }>(),
    'Get By Id': props<{ id: string }>(),
    'Get Stats': emptyProps(),
    'Create Experience': props<{ data: CreateExperienceDto }>(),
    'Update Experience': props<{ id: string; data: UpdateExperienceDto }>(),
    'Move Up Experience': props<{ id: string }>(),
    'Move Down Experience': props<{ id: string }>(),
    'Delete Experience': props<{ id: string }>(),

    // Success
    'Get All Success': props<{ data: ExperienceData }>(),
    'Get By Id Success': props<{ experience: ExperienceList }>(),
    'Get Stats Success': props<{ stats: ExperienceCount }>(),
    'Create Experience Success': emptyProps(),
    'Update Experience Success': props<{ id: string }>(),
    'Move Up Experience Success': props<{ id: string }>(),
    'Move Down Experience Success': props<{ id: string }>(),
    'Delete Experience Success': props<{ id: string }>(),

    // Failure
    'Get All Failure': props<{ error: string; statusCode: number }>(),
    'Get By Id Failure': props<{ error: string; statusCode: number }>(),
    'Get Stats Failure': props<{ error: string; statusCode: number }>(),
    'Create Experience Failure': props<{ error: string; statusCode: number }>(),
    'Update Experience Failure': props<{ error: string; statusCode: number }>(),
    'Move Up Experience Failure': props<{ error: string; statusCode: number }>(),
    'Move Down Experience Failure': props<{ error: string; statusCode: number }>(),
    'Delete Experience Failure': props<{ error: string; statusCode: number }>(),

    // Misc
    'Clear Error': emptyProps(),
  },
});
