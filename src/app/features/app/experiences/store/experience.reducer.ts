import { createFeature, createReducer, on } from '@ngrx/store';
import { ExperiencesActions } from './experience.action';
import { ExperienceState } from '../interfaces';

const initialState: ExperienceState = {
  experiences: [],
  selected: null,
  meta: null,
  isLoading: false,
  error: null,
  statusCode: null,
  formError: null,
  formStatusCode: null,
  isLoadingForm: false,
  stats: null,
  isLoadingStats: false,
};

export const experienceFeature = createFeature({
  name: 'experiences',
  reducer: createReducer(
    initialState,

    on(ExperiencesActions.getAll, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(ExperiencesActions.getAllSuccess, (state, { data }) => ({
      ...state,
      isLoading: false,
      experiences: data.experiences,
      meta: data.meta,
    })),

    on(ExperiencesActions.getAllFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
    })),

    on(ExperiencesActions.getById, state => ({
      ...state,
      selected: null,
      isLoading: true,
    })),

    on(ExperiencesActions.getByIdSuccess, (state, { experience }) => ({
      ...state,
      selected: experience,
      isLoading: false,
    })),

    on(ExperiencesActions.getByIdFailure, (state, { error, statusCode }) => ({
      ...state,
      error,
      statusCode,
      isLoading: false,
    })),

    on(ExperiencesActions.clearError, state => ({
      ...state,
      error: null,
      statusCode: null,
    })),

    on(ExperiencesActions.getStats, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
      isLoadingStats: true,
    })),

    on(ExperiencesActions.getStatsSuccess, (state, { stats }) => ({
      ...state,
      isLoading: false,
      isLoadingStats: false,
      stats,
    })),

    on(ExperiencesActions.getStatsFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      isLoadingStats: false,
      error,
      statusCode,
    })),

    on(ExperiencesActions.createExperience, state => ({
      ...state,
      error: null,
      statusCode: null,
      isLoadingForm: true,
    })),

    on(ExperiencesActions.createExperienceSuccess, state => ({
      ...state,
      experiences: state.experiences,
      stats: state.stats,
      isLoadingForm: false,
    })),

    on(ExperiencesActions.createExperienceFailure, (state, { error, statusCode }) => ({
      ...state,
      error,
      statusCode,
      formError: error,
      formStatusCode: statusCode,
      isLoadingForm: false,
    })),

    on(ExperiencesActions.updateExperience, state => ({
      ...state,
      error: null,
      statusCode: null,
      isLoadingForm: true,
    })),

    on(ExperiencesActions.updateExperienceSuccess, (state, { id }) => ({
      ...state,
      experiences: state.experiences.map(c => (c.id === id ? { ...c } : c)),
      stats: state.stats,
      isLoadingForm: false,
    })),

    on(ExperiencesActions.updateExperienceFailure, (state, { error, statusCode }) => ({
      ...state,
      error,
      statusCode,
      formError: error,
      formStatusCode: statusCode,
      isLoadingForm: false,
    })),

    on(ExperiencesActions.deleteExperience, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(ExperiencesActions.deleteExperienceSuccess, (state, { id }) => ({
      ...state,
      isLoading: false,
      experiences: state.experiences.filter(s => s.id !== id),
    })),

    on(ExperiencesActions.deleteExperienceFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
      formError: error,
      formStatusCode: statusCode,
    })),

    on(ExperiencesActions.clearError, state => ({
      ...state,
      error: null,
      statusCode: null,
      formError: null,
      formStatusCode: null,
    }))
  ),
});
