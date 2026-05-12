import { userFeature } from './user.reducer';

export const selectUser = userFeature.selectUser;
export const selectUserLoading = userFeature.selectIsLoading;
export const selectUserError = userFeature.selectError;
export const selectUserErrorStatusCode = userFeature.selectStatusCode;
export const selectUserStatusCode = userFeature.selectStatusCode;
export const selectUserPasswordFormError = userFeature.selectFormPasswordError;
export const selectUserProfileFormError = userFeature.selectFormProfileError;
export const selectUserProfileFormLoading = userFeature.selectIsLoadingProfileForm;
export const selectUserPasswordFormLoading = userFeature.selectIsLoadingPasswordForm;
export const selectUserProfileStatusCode = userFeature.selectFormProfileStatusCode;
export const selectUserPasswordStatusCode = userFeature.selectFormPasswordStatusCode;
