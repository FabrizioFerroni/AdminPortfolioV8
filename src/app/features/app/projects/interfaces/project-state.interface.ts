import { Pagination } from '@/shared/interfaces';
import { ProjectCount, ProjectImageList, ProjectList } from './project.interface';

export interface ProjectState {
  projects: ProjectList[];
  project: ProjectList | null;
  meta: Pagination | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  //TODO: de aca para abajo es para los metodos C.U del proyecto.
  formError: string | null;
  formStatusCode: number | null;
  isLoadingForm: boolean;
  stats: ProjectCount | null;
  isLoadingStats: boolean;
  //TODO: Images states
  imagesProject: ProjectImageList[] | null;
  imageLoadingProject: boolean;
  imageErrorProject: string | null;
  imageStatusCodeProject: number | null;
}

export interface ProjectData {
  projects: ProjectList[];
  meta: Pagination;
}
