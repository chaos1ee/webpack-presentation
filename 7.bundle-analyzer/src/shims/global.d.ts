export {}

declare global {
  interface BackendResponse<T> {
    msg: string
    data: T
  }

  interface ListResponse<T> {
    List: T[]
    Page?: number
    PerPage?: number
    Total?: number
  }

  // TODO: to be removed
  interface ListParams {
    Page?: number
    PerPage?: number
  }

  interface PaginationParams {
    page?: number
    size?: number
  }
}
