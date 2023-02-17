import { createQueryKeys } from '@lukemorales/query-key-factory'
import { TOKEN_FLAG } from '~/constants'
import { batchCheck, check, login } from '~/services'

export const global = createQueryKeys('global', {
  token: (ticket?: string | null) => ({
    queryKey: [{ ticket }],
    queryFn: () =>
      ticket === null || ticket === undefined
        ? Promise.resolve(localStorage.getItem(TOKEN_FLAG))
        : login(ticket).then(({ token }) => {
            localStorage.setItem(TOKEN_FLAG, token)
            return token
          }),
  }),
  permission: (filters?: string) => ({
    queryKey: [{ filters }],
    queryFn: () => check(filters),
  }),
  bulkPermissions: <T extends string>(filters: Record<T, string>) => ({
    queryKey: [{ filters }],
    queryFn: () => batchCheck(filters),
  }),
})
