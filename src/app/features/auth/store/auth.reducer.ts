import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthState } from '../interfaces/auth-state';
import { AuthActions } from './auth.actions';

const initialState: AuthState = {
  user: null,
  isLogged: false,
  isLoading: false,
  error: null,
  statusCode: null,
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
