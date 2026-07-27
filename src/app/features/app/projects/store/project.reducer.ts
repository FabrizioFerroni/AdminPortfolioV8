import { createFeature, createReducer, on } from '@ngrx/store';
import { ProjectState } from '../interfaces';
import { ProjectsActions } from './project.action';

const initialState: ProjectState = {
  projects: [],
  project: null,
  meta: null,
  isLoading: false,
  error: null,
  statusCode: null,
  formError: null,
  formStatusCode: null,
  isLoadingForm: false,
  stats: null,
  isLoadingStats: false,
  imagesProject: null,
  imageLoadingProject: false,
  imageErrorProject: null,
  imageStatusCodeProject: null,
  projectsSelect: [],
  isLoadingSelect: false,
  errorSelect: null,
  statusCodeSelect: null,
};

export const projectFeature = createFeature({
  name: 'projects',
  reducer: createReducer(
    initialState,

    on(ProjectsActions.getAll, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(ProjectsActions.getAllSuccess, (state, { data }) => ({
      ...state,
      isLoading: false,
      projects: data.projects,
      meta: data.meta,
    })),

    on(ProjectsActions.getAllFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
    })),

    on(ProjectsActions.getStats, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
      isLoadingStats: true,
    })),

    on(ProjectsActions.getStatsSuccess, (state, { stats }) => ({
      ...state,
      isLoading: false,
      isLoadingStats: false,
      stats,
    })),

    on(ProjectsActions.getStatsFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      isLoadingStats: false,
      error,
      statusCode,
    })),

    on(ProjectsActions.getById, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(ProjectsActions.getByIdSuccess, (state, { project }) => ({
      ...state,
      isLoading: false,
      error: null,
      statusCode: 200,
      project: project,
    })),

    on(ProjectsActions.getByIdFailure, (state, { error, statusCode }) => ({
      ...state,
      error,
      statusCode,
    })),

    on(ProjectsActions.getImagesByProjectId, state => ({
      ...state,
      imageLoadingProject: true,
      imageErrorProject: null,
      imageStatusCodeProject: null,
    })),

    on(ProjectsActions.getImagesByProjectIdSuccess, (state, { images }) => ({
      ...state,
      imageLoadingProject: false,
      imageErrorProject: null,
      imageStatusCodeProject: 200,
      imagesProject: images,
    })),

    on(ProjectsActions.getImagesByProjectIdFailure, (state, { error, statusCode }) => ({
      ...state,
      imageErrorProject: error,
      imageStatusCodeProject: statusCode,
    })),

    on(ProjectsActions.createProject, state => ({
      ...state,
      error: null,
      statusCode: null,
      isLoadingForm: true,
    })),

    on(ProjectsActions.createProjectSuccess, state => ({
      ...state,
      projects: state.projects,
      stats: state.stats,
      isLoadingForm: false,
    })),

    on(ProjectsActions.createProjectFailure, (state, { error, statusCode }) => ({
      ...state,
      error,
      statusCode,
      formError: error,
      formStatusCode: statusCode,
      isLoadingForm: false,
    })),

    on(ProjectsActions.createProjectImage, state => ({
      ...state,
      imageErrorProject: null,
      imageStatusCodeProject: null,
      imageLoadingProject: true,
    })),

    on(ProjectsActions.createProjectImageSuccess, state => ({
      ...state,
      imageErrorProject: null,
      imageStatusCodeProject: 201,
      imageLoadingProject: false,
    })),

    on(ProjectsActions.createProjectImageFailure, (state, { error, statusCode }) => ({
      ...state,
      imageErrorProject: error,
      imageStatusCodeProject: statusCode,
      imageLoadingProject: false,
    })),

    on(ProjectsActions.updateProject, state => ({
      ...state,
      error: null,
      statusCode: null,
      isLoadingForm: true,
    })),

    on(ProjectsActions.updateProjectSuccess, state => ({
      ...state,
      isLoadingForm: false,
      formError: null,
      formStatusCode: 200,
    })),

    on(ProjectsActions.updateProjectFailure, (state, { error, statusCode }) => ({
      ...state,
      error,
      statusCode,
      formError: error,
      formStatusCode: statusCode,
      isLoadingForm: false,
    })),

    on(ProjectsActions.deleteProject, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(ProjectsActions.deleteProjectSuccess, (state, { id }) => ({
      ...state,
      isLoading: false,
      projects: state.projects.filter(p => p.id !== id),
    })),

    on(ProjectsActions.deleteProjectFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
      formError: error,
      formStatusCode: statusCode,
    })),

    on(ProjectsActions.deleteProjectImage, state => ({
      ...state,
      imageLoadingProject: true,
      imageErrorProject: null,
      imageStatusCodeProject: null,
    })),

    on(ProjectsActions.deleteProjectImageSuccess, state => ({
      ...state,
      imageLoadingProject: false,
      imageStatusCodeProject: 200,
      imageErrorProject: null,
    })),

    on(ProjectsActions.deleteProjectImageFailure, (state, { error, statusCode }) => ({
      ...state,
      imageLoadingProject: false,
      imageErrorProject: error,
      imageStatusCodeProject: statusCode,
    })),

    on(ProjectsActions.deleteProjectImageAll, state => ({
      ...state,
      imageLoadingProject: true,
      imageErrorProject: null,
      imageStatusCodeProject: null,
    })),

    on(ProjectsActions.deleteProjectImageAllSuccess, (state, { projectId }) => ({
      ...state,
      imageLoadingProject: false,
      projects: state.projects.filter(p => p.id !== projectId),
      imageStatusCodeProject: 200,
      imageErrorProject: null,
    })),

    on(ProjectsActions.deleteProjectImageAllFailure, (state, { error, statusCode }) => ({
      ...state,
      imageLoadingProject: false,
      imageErrorProject: error,
      imageStatusCodeProject: statusCode,
    })),

    on(ProjectsActions.clearError, state => ({
      ...state,
      formError: null,
      formStatusCode: null,
    })),

    on(ProjectsActions.getProjectSelect, state => ({
      ...state,
      isLoadingSelect: true,
      errorSelect: null,
      statusCodeSelect: null,
    })),

    on(ProjectsActions.getProjectSelectSuccess, (state, { select }) => ({
      ...state,
      projectsSelect: select,
      isLoadingSelect: false,
    })),

    on(ProjectsActions.getProjectSelectFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoadingSelect: false,
      errorSelect: error,
      statusCodeSelect: statusCode,
    }))
  ),
});
