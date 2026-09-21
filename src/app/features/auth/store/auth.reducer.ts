import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthState } from '../interfaces/auth-state';
import { AuthActions } from './auth.actions';

const initialState: AuthState = {
  user: null,
  isLogged: false,
  isLoading: false,
  error: null,
  statusCode: null,
  messageForgot: null,
  isLoadingForgot: false,
  errorForgot: null,
  statusCodeForgot: null,
  resultChangePassword: null,
  isLoadingChangePassword: false,
  errorChangePassword: null,
  statusCodeChangePassword: null,
  verifyPassword: null,
  isLoadingVerify: false,
  errorVerify: null,
  statusCodeVerify: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,

    on(AuthActions.login, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(AuthActions.loginSuccess, (state, { user }) => ({
      ...state,
      user,
      isLogged: true,
      isLoading: false,
      error: null,
    })),

    on(AuthActions.loginFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
    })),

    on(AuthActions.forgotPassword, state => ({
      ...state,
      isLoadingForgot: true,
      errorForgot: null,
      messageForgot: null,
      statusCodeForgot: null,
    })),

    on(AuthActions.forgotPasswordSuccess, (state, { message }) => ({
      ...state,
      isLoadingForgot: false,
      messageForgot: message,
      errorForgot: null,
      statusCodeForgot: null,
    })),

    on(AuthActions.forgotPasswordFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoadingForgot: false,
      errorForgot: error,
      statusCodeForgot: statusCode,
    })),

    on(AuthActions.clearForgotMessage, state => ({
      ...state,
      messageForgot: null,
    })),

    on(AuthActions.verifyTokenPassword, state => ({
      ...state,
      isLoadingVerify: true,
      verifyPassword: null,
      errorVerify: null,
      statusCodeVerify: null,
    })),

    on(AuthActions.verifyTokenPasswordSuccess, (state, { message }) => ({
      ...state,
      isLoadingVerify: false,
      verifyPassword: message,
      errorVerify: null,
      statusCodeVerify: 200,
    })),

    on(AuthActions.verifyTokenPasswordFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoadingVerify: false,
      verifyPassword: null,
      errorVerify: error,
      statusCodeVerify: statusCode,
    })),

    on(AuthActions.changePassword, state => ({
      ...state,
      isLoadingChangePassword: true,
      resultChangePassword: null,
      errorChangePassword: null,
      statusCodeChangePassword: null,
    })),

    on(AuthActions.changePasswordSuccess, (state, { message }) => ({
      ...state,
      resultChangePassword: message,
      isLoadingChangePassword: false,
      errorChangePassword: null,
      statusCodeChangePassword: 200,
    })),

    on(AuthActions.changePasswordFailure, (state, { error, statusCode }) => ({
      ...state,
      resultChangePassword: null,
      isLoadingChangePassword: false,
      errorChangePassword: error,
      statusCodeChangePassword: statusCode,
    })),

    on(AuthActions.logout, () => ({ ...initialState })),

    on(AuthActions.updateUser, (state, { user }) => ({
      ...state,
      user: state.user ? { ...state.user, ...user } : null,
    })),

    on(AuthActions.clearError, state => ({
      ...state,
      error: null,
      statusCode: null,
    })),
    on(AuthActions.hydrate, (state, { user }) => ({
      ...state,
      user,
      isLogged: true,
    }))
  ),
});
