import { useQuery } from '@tanstack/react-query'
import { global } from '~/queries'

export function useToken(ticket?: string | null) {
  const { data, ...restValues } = useQuery(global.token(ticket))
  return { ...restValues, token: data }
}

export function usePermission(code?: string) {
  const query = useQuery({ ...global.permission(code), retryDelay: 20000 })

  return {
    ...query,
    data: query.data ?? false,
  }
}

export function usePermissions<T extends string>(codes: Record<T, string>) {
  const { data, ...restValues } = useQuery({ ...global.bulkPermissions(codes), retryDelay: 20000 })

  return {
    ...restValues,
    permissions: data,
  }
}
