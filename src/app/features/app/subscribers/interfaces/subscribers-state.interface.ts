import { SubscriberCount, SubscriberList } from './subscriber.interface';

export interface SubscribersMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SubscribersState {
  subscribers: SubscriberList[];
  selected: SubscriberList | null;
  meta: SubscribersMeta | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  stats: SubscriberCount | null;
  isLoadingStats: boolean;
}

export interface SubscribersMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SubscribersData {
  subscribers: SubscriberList[];
  meta: SubscribersMeta;
}
