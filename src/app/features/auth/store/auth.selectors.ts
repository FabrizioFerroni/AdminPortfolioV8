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

//TODO: Forgot Password
export const messageForgot = authFeature.selectMessageForgot;
export const isLoadingForgot = authFeature.selectIsLoadingForgot;
export const errorForgot = authFeature.selectErrorForgot;
export const statusCodeForgot = authFeature.selectStatusCodeForgot;

//TODO: Change Password
export const resultChangePassword = authFeature.selectResultChangePassword;
export const isLoadingChangePassword = authFeature.selectIsLoadingChangePassword;
export const errorChangePassword = authFeature.selectErrorChangePassword;
export const statusCodeChangePassword = authFeature.selectStatusCodeChangePassword;

//TODO: Verify Password
export const verifyPassword = authFeature.selectVerifyPassword;
export const isLoadingVerifyPassword = authFeature.selectIsLoadingVerify;
export const errorVerifyPassword = authFeature.selectErrorVerify;
export const statusCodeVerifyPassword = authFeature.selectStatusCodeVerify;
