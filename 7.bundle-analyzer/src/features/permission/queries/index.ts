import { createQueryKeys } from '@lukemorales/query-key-factory'
import { getPermissionEnum, getRoleEnum, getUserList } from '~/features/permission/services'

export const permission = createQueryKeys('permission', {
  userList: (pagination?: PaginationParams) => ({
    queryKey: [{ pagination }],
    queryFn: () => getUserList(pagination),
  }),
  allRoles: () => ({
    queryKey: [{}],
    queryFn: getRoleEnum,
  }),
  allPermissions: () => ({
    queryKey: [{}],
    queryFn: getPermissionEnum,
  }),
})
