import { TestimonialCount, TestimonialList } from './testimonial.interface';

export interface TestimonialMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TestimonialState {
  testimonials: TestimonialList[];
  testimonial: TestimonialList | null;
  meta: TestimonialMeta | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  stats: TestimonialCount | null;
  isLoadingStats: boolean;
  //TODO: de aca para abajo es para los metodos C.U del form.
  formError: string | null;
  formStatusCode: number | null;
  isLoadingForm: boolean;
}

export interface TestimonialData {
  testimonials: TestimonialList[];
  meta: TestimonialMeta;
}
