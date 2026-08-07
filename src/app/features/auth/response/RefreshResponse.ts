import { ApiResponse } from '@/shared/response';

interface Data {
  access_token: string;
}

export type RefreshResponse = ApiResponse<Data>;
