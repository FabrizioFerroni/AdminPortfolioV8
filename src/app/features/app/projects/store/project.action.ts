import { PaginacionQuery } from '@/shared/interfaces';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ProjectCount,
  ProjectData,
  ProjectImageList,
  ProjectList,
  ProjectResponseSelectDto,
} from '../interfaces';

export const ProjectsActions = createActionGroup({
  source: 'Projects',
  events: {
    // Triggers
    'Get All': props<{ paginado: PaginacionQuery }>(),
    'Get By Id': props<{ id: string }>(),
    'Get Images By ProjectId': props<{ projectId: string }>(),
    'Get Stats': emptyProps(),
    'Get Project Select': emptyProps(),
    'Create Project': props<{ data: FormData }>(),
    'Create Project Image': props<{ data: FormData }>(),
    'Update Project': props<{ id: string; data: FormData }>(),
    'Delete Project': props<{ id: string }>(),
    'Delete Project Image': props<{ id: string; projectId: string }>(),
    'Delete Project Image All': props<{ projectId: string }>(),

    // Success
    'Get All Success': props<{ data: ProjectData }>(),
    'Get By Id Success': props<{ project: ProjectList | null }>(),
    'Get Images By ProjectId Success': props<{ images: ProjectImageList[] }>(),
    'Get Stats Success': props<{ stats: ProjectCount }>(),
    'Get Project Select Success': props<{ select: ProjectResponseSelectDto[] }>(),
    'Create Project Success': emptyProps(),
    'Create Project Image Success': emptyProps(),
    'Update Project Success': emptyProps(),
    'Delete Project Success': props<{ id: string }>(),
    'Delete Project Image Success': props<{ id: string }>(),
    'Delete Project Image All Success': props<{ projectId: string }>(),

    // Failure
    'Get All Failure': props<{ error: string; statusCode: number }>(),
    'Get By Id Failure': props<{ error: string; statusCode: number }>(),
    'Get Images By ProjectId Failure': props<{ error: string; statusCode: number }>(),
    'Get Stats Failure': props<{ error: string; statusCode: number }>(),
    'Get Project Select Failure': props<{ error: string; statusCode: number }>(),
    'Create Project Failure': props<{ error: string; statusCode: number }>(),
    'Create Project Image Failure': props<{ error: string; statusCode: number }>(),
    'Update Project Failure': props<{ error: string; statusCode: number }>(),
    'Delete Project Failure': props<{ error: string; statusCode: number }>(),
    'Delete Project Image Failure': props<{ error: string; statusCode: number }>(),
    'Delete Project Image All Failure': props<{ error: string; statusCode: number }>(),

    // Misc
    'Clear Error': emptyProps(),
  },
});
