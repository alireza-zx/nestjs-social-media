export interface PaginationOptions<T> {
  where?: [keyof T, string, any],
  relations?: string[]
}