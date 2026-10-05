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

  //get cv
  isLoadingGetCv: false,
  getCV: null,
  errorGetCv: null,
  statusCodeGetCV: null,

  // Upload cv
  isLoadingUploadCV: false,
  uploadCV: null,
  errorUploadCv: null,
  statusCodeUploadCV: null,

  // Download CV
  isLoadingDownloadCV: false,
  downloadCV: null,
  errorDownloadCV: null,
  statusCodeDownloadCV: null,

  //Get Olds CV
  isLoadingGetOldsCvs: false,
  getOldsCVS: null,
  errorGetOldsCvs: null,
  statusCodeGetOldsCVS: null,
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

export const cvFeature = createFeature({
  name: 'cv',
  reducer: createReducer(
    initialState,

    on(UserActions.getCV, state => ({
      ...state,
      isLoadingGetCv: true,
      getCV: null,
      errorGetCv: null,
      statusCodeGetCV: null,
    })),

    on(UserActions.getCVSuccess, (state, { data }) => ({
      ...state,
      isLoadingGetCv: false,
      getCV: data,
      errorGetCv: null,
      statusCodeGetCV: 200,
    })),

    on(UserActions.getCVFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoadingGetCv: false,
      getCV: null,
      errorGetCv: error,
      statusCodeGetCV: statusCode,
    })),

    on(UserActions.uploadCV, state => ({
      ...state,
      isLoadingUploadCV: true,
      uploadCV: null,
      errorUploadCv: null,
      statusCodeUploadCV: null,
    })),

    on(UserActions.uploadCVSuccess, (state, { data }) => ({
      ...state,
      isLoadingUploadCV: false,
      uploadCV: data,
      errorUploadCv: null,
      statusCodeUploadCV: null,
    })),

    on(UserActions.uploadCVFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoadingUploadCV: false,
      uploadCV: null,
      errorUploadCv: error,
      statusCodeUploadCV: statusCode,
    })),

    on(UserActions.downloadCV, state => ({
      ...state,
      isLoadingDownloadCV: true,
      downloadCV: null,
      errorDownloadCv: null,
      statusCodeDownloadCV: null,
    })),

    on(UserActions.downloadCVSuccess, (state, { filename }) => ({
      ...state,
      isLoadingDownloadCV: false,
      downloadCV: filename,
      errorDownloadCv: null,
      statusCodeDownloadCV: null,
    })),

    on(UserActions.downloadCVFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoadingDownloadCV: false,
      downloadCV: null,
      errorDownloadCv: error,
      statusCodeDownloadCV: statusCode,
    })),

    on(UserActions.getOldsCV, state => ({
      ...state,
      isLoadingGetOldsCvs: true,
      getOldsCVS: null,
      errorGetOldsCvs: null,
      statusCodeGetOldsCVS: null,
    })),

    on(UserActions.getOldsCVSuccess, (state, { data }) => ({
      ...state,
      isLoadingGetOldsCvs: false,
      getOldsCVS: data,
      errorGetOldsCvs: null,
      statusCodeGetOldsCVS: 200,
    })),

    on(UserActions.getOldsCVFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoadingGetOldsCvs: false,
      getOldsCVS: null,
      errorGetOldsCvs: error,
      statusCodeGetOldsCVS: statusCode,
    }))
  ),
});
