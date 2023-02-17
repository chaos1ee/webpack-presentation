import { createQueryKeys } from '@lukemorales/query-key-factory'
import { getBulletinList } from '~/features/bulletin/services'

export const queries = createQueryKeys('bulletin', {
  list: (pagination?: PaginationParams) => ({
    queryKey: [{ pagination }],
    queryFn: () => getBulletinList(pagination),
  }),
})
