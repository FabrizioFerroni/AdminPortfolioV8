import { Storage } from '../utils';

export interface TokenInfo {
  token: string | null;
  source: Storage.LOCAL_STORAGE | Storage.SESSION_STORAGE | Storage.NONE;
}
