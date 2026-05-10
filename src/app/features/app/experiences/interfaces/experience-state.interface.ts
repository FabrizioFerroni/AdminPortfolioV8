import { Pagination } from '@/shared/interfaces';
import { ExperienceCount, ExperienceList } from './experience.interface';

export interface ExperienceState {
  experiences: ExperienceList[];
  selected: ExperienceList | null;
  meta: Pagination | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  formError: string | null;
  formStatusCode: number | null;
  isLoadingForm: boolean;
  stats: ExperienceCount | null;
  isLoadingStats: boolean;
}

export interface ExperienceData {
  experiences: ExperienceList[];
  meta: Pagination;
}
