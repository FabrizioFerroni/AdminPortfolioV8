import { createFeature, createReducer, on } from '@ngrx/store';
import { UserState } from '../interfaces';
import { UserActions } from './user.action';

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  statusCode: null,
  formProfileError: null,
  formPasswordError: null,
  formProfileStatusCode: null,
  formPasswordStatusCode: null,
  isLoadingProfileForm: false,
  isLoadingPasswordForm: false,

  //sessions
  isLoadingSessions: false,
  sessions: null,
  errorSessions: null,
  statusCodeSessions: null,

  // delete sessions id
  isLoadingDeleteIdSession: false,
  deleteIdSession: null,
  errorIdSession: null,
  statusCodeIdSession: null,

  // delete sessions all
  isLoadingDeleteAllSession: false,
  deleteAllSession: null,
  errorAllSession: null,
  statusCodeAllSession: null,
};

export const userFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialState,
    on(UserActions.getUser, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(UserActions.getUserSuccess, (state, { data }) => ({
      ...state,
      isLoading: false,
      user: data,
    })),

    on(UserActions.getUserFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
    })),

    on(UserActions.updateProfile, state => ({
      ...state,
      error: null,
      statusCode: null,
      isLoadingProfileForm: true,
    })),

    on(UserActions.updateProfileSuccess, state => ({
      ...state,
      statusCode: null,
      formProfileStatusCode: null,
      isLoadingProfileForm: false,
    })),

    on(UserActions.updateProfileFailure, (state, { error, statusCode }) => ({
      ...state,
      error,
      statusCode,
      formProfileError: error,
      formProfileStatusCode: statusCode,
      isLoadingProfileForm: false,
    })),

    on(UserActions.updatePassword, state => ({
      ...state,
      error: null,
      statusCode: null,
      isLoadingPasswordForm: true,
    })),

    on(UserActions.updatePasswordSuccess, state => ({
      ...state,
      statusCode: null,
      formPasswordStatusCode: null,
      isLoadingPasswordForm: false,
    })),

    on(UserActions.updatePasswordFailure, (state, { error, statusCode }) => ({
      ...state,
      error,
      statusCode,
      formError: error,
      formPasswordStatusCode: statusCode,
      isLoadingPasswordForm: false,
    })),

    on(UserActions.clearError, state => ({
      ...state,
      error: null,
      statusCode: null,
      formPasswordError: null,
      formProfileError: null,
      formProfileStatusCode: null,
      formPasswordStatusCode: null,
    })),

    on(UserActions.getAllSesions, state => ({
      ...state,
      isLoadingSessions: true,
      sessions: null,
      errorSessions: null,
      statusCodeSessions: null,
    })),

    on(UserActions.getAllSesionsSuccess, (state, { data }) => ({
      ...state,
      isLoadingSessions: false,
      sessions: data,
      errorSessions: null,
      statusCodeSessions: null,
    })),

    on(UserActions.getAllSesionsFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoadingSessions: false,
      sessions: null,
      errorSessions: error,
      statusCodeSessions: statusCode,
    })),

    on(UserActions.deleteSessionByID, state => ({
      ...state,
      isLoadingDeleteIdSession: true,
      isLoadingSessions: true,
      deleteIdSession: null,
      errorIdSession: null,
      statusCodeIdSession: null,
    })),

    on(UserActions.deleteSessionByIDSuccess, (state, { sessionId, data }) => ({
      ...state,
      isLoadingDeleteIdSession: false,
      isLoadingSessions: false,
      deleteIdSession: data,
      errorIdSession: null,
      statusCodeIdSession: null,
      sessions: state.sessions!.filter(s => s.id !== sessionId),
    })),

    on(UserActions.deleteSessionByIDFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoadingDeleteIdSession: false,
      isLoadingSessions: false,
      deleteIdSession: null,
      errorIdSession: error,
      statusCodeIdSession: statusCode,
    })),

    on(UserActions.deleteAllSesions, state => ({
      ...state,
      isLoadingDeleteAllSession: true,
      isLoadingSessions: true,
      deleteAllSession: null,
      errorAllSession: null,
      statusCodeAllSession: null,
    })),

    on(UserActions.deleteAllSesionsSuccess, (state, { data }) => ({
      ...state,
      isLoadingDeleteAllSession: false,
      isLoadingSessions: false,
      deleteAllSession: data,
      errorAllSession: null,
      statusCodeAllSession: null,
      sessions: state.sessions?.filter(s => s.current) ?? null,
    })),

    on(UserActions.deleteAllSesionsFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoadingDeleteAllSession: false,
      isLoadingSessions: false,
      deleteAllSession: null,
      errorAllSession: error,
      statusCodeAllSession: statusCode,
    }))
  ),
});
