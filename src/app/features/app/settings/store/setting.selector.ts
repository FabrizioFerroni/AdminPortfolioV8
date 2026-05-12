import { settingFeature } from './setting.reducer';

// TODO: Estos selectors son para el get de settings
export const selectSetting = settingFeature.selectSetting;
export const loadingSetting = settingFeature.selectIsLoading;
export const errorSetting = settingFeature.selectError;
export const statusCodeSetting = settingFeature.selectStatusCode;
export const settingState = settingFeature.selectSettingsState;

//TODO: Estos selectors son para el update a setting
export const loadingFormSetting = settingFeature.selectIsLoadingForm;
export const errorFormSetting = settingFeature.selectFormError;
export const statusCodeFormSetting = settingFeature.selectFormStatusCode;
