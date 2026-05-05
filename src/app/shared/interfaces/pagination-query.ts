export interface PaginacionQuery {
  page: number;
  limit: number;
  search?: string | null;
}

export interface PaginationAuditQuery extends PaginacionQuery {
  actions?: string | null;
  time?: string | null;
}
