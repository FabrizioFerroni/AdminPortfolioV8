import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducer';

export const selectAuthUser = authFeature.selectUser;
export const selectIsLogged = authFeature.selectIsLogged;
export const selectIsLoading = authFeature.selectIsLoading;
export const selectAuthError = authFeature.selectError;
export const selectAuthStatusCode = authFeature.selectStatusCode;

export const selectUserFullName = createSelector(selectAuthUser, user =>
  user ? `${user.name} ${user.lastname}` : ''
);
