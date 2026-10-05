import { cvFeature, userFeature } from './user.reducer';

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

//sessions
export const sessions = userFeature.selectSessions;
export const isLoadingSessions = userFeature.selectIsLoadingSessions;
export const errorSessions = userFeature.selectErrorSessions;
export const statusCodeSessions = userFeature.selectStatusCodeSessions;

//delete session id
export const deleteIdSession = userFeature.selectDeleteIdSession;
export const isLoadingDeleteIdSession = userFeature.selectIsLoadingDeleteIdSession;
export const errorDeleteIdSession = userFeature.selectErrorIdSession;
export const statusCodeDeleteIdSession = userFeature.selectStatusCodeIdSession;

//delete session all
export const deleteAllSession = userFeature.selectDeleteAllSession;
export const isLoadingDeleteAllSession = userFeature.selectIsLoadingDeleteAllSession;
export const errorDeleteAllSession = userFeature.selectErrorAllSession;
export const statusCodeDeleteAllSession = userFeature.selectStatusCodeIdSession;

//get CV
export const getCVData = cvFeature.selectGetCV;
export const isLoadingGetCV = cvFeature.selectIsLoadingGetCv;
export const errorGetCV = cvFeature.selectErrorGetCv;
export const statusCodeGetCV = cvFeature.selectStatusCodeGetCV;

//upload CV
export const uploadCVFront = cvFeature.selectUploadCV;
export const isLoadingUploadCV = cvFeature.selectIsLoadingUploadCV;
export const errorUploadCV = cvFeature.selectErrorUploadCv;
export const statusCodeUploadCV = cvFeature.selectStatusCodeUploadCV;

//download CV
export const downloadCV = cvFeature.selectDownloadCV;
export const isLoadingDownloadCV = cvFeature.selectIsLoadingDownloadCV;
export const errorDownloadCV = cvFeature.selectErrorDownloadCV;
export const statusCodeDownloadCV = cvFeature.selectStatusCodeDownloadCV;

//get Olds CV
export const getOldsCVSData = cvFeature.selectGetOldsCVS;
export const isLoadingGetOldsCVS = cvFeature.selectIsLoadingGetOldsCvs;
export const errorGetOldsCVS = cvFeature.selectErrorGetOldsCvs;
export const statusCodeGetOldsCVS = cvFeature.selectStatusCodeGetOldsCVS;
