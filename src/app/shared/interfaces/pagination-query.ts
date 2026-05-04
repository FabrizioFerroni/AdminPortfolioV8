export interface PaginacionQuery {
  page: number;
  limit: number;
  search?: string | null;
}
