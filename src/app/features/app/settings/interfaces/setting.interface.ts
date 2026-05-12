export interface SettingList {
  id: string;
  frontUrl: string;
  maintenanceMode: boolean;
}

export interface UpdateSettingDto {
  frontUrl: string;
  maintenanceMode: boolean;
}
