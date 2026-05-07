import { Pagination } from '@/shared/interfaces';
import { ContactCount, ContactList } from './contact.interface';

export interface ContactState {
  contacts: ContactList[];
  selected: ContactList | null;
  meta: Pagination | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  stats: ContactCount | null;
  isLoadingStats: boolean;
}

export interface ContactData {
  contacts: ContactList[];
  meta: Pagination;
}
