import { createFeature, createReducer, on } from '@ngrx/store';
import { SettingState } from '../interfaces';
import { SettingActions } from './setting.action';

const initialState: SettingState = {
  setting: null,
  isLoading: false,
  error: null,
  statusCode: null,
  formError: null,
  formStatusCode: null,
  isLoadingForm: false,
};

export const settingFeature = createFeature({
  name: 'settings',
  reducer: createReducer(
    initialState,
    on(SettingActions.getSetting, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),
    on(SettingActions.getSettingSuccess, (state, { data }) => ({
      ...state,
      isLoading: false,
      setting: data,
    })),

    on(SettingActions.getSettingFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
    })),

    on(SettingActions.updateSetting, state => ({
      ...state,
      formError: null,
      formStatusCode: null,
      isLoadingForm: true,
    })),

    on(SettingActions.updateSettingSuccess, state => ({
      ...state,
      statusCode: null,
      formStatusCode: null,
      isLoadingForm: false,
    })),

    on(SettingActions.updateSettingFailure, (state, { error, statusCode }) => ({
      ...state,
      error,
      statusCode,
      formError: error,
      formStatusCode: statusCode,
      isLoadingForm: false,
    })),

    on(SettingActions.clearError, state => ({
      ...state,
      formError: null,
      formStatusCode: null,
    }))
  ),
});
