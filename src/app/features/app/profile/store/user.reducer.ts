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
    }))
  ),
});
