import { useQuery } from '@tanstack/react-query'
import { permission } from '~/features/permission'
import { usePermission } from '~/hooks'

export function useAllPermissions() {
  const { data, ...restData } = useQuery({
    ...permission.allPermissions(),
  })

  return {
    permissions: data,
    ...restData,
  }
}

export function useAllRoles() {
  const { data: enabled } = usePermission('200005')
  const { data, ...restData } = useQuery({
    ...permission.allRoles(),
    enabled,
  })

  if (!enabled) {
    return {
      ...restData,
      roles: [],
      isLoading: false,
      isError: true,
    }
  }

  return {
    ...restData,
    roles: data,
  }
}
