import { SettingList } from './setting.interface';

export interface SettingState {
  setting: SettingList | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  formError: string | null;
  formStatusCode: number | null;
  isLoadingForm: boolean;
}

export interface SettingData {
  setting: SettingList | null;
}
