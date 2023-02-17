import type { QueryFunction, QueryKey } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { FormInstance } from 'antd'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Ref } from 'react'
import * as React from 'react'
import { forwardRef } from 'react'
import { QueryFilter } from '~/components/QueryFilter'
import { usePermission } from '~/hooks'
import { NoPermissionCover } from './NoPermissionCover'

export interface QueryListProps<T, F> {
  code?: string
  columns?: ColumnsType<T>
  queryKey?: QueryKey
  queryFn?: QueryFunction<ListResponse<T>>
  queryFilterRender?: (form: FormInstance<F>) => React.ReactNode
}

// TODO:
// 1. 分页参数传入 query
const InternalQueryList = <T extends object, F extends object>(
  props: QueryListProps<T, F>,
  ref: Ref<FormInstance<F>>,
) => {
  const { code, columns, queryKey, queryFn, queryFilterRender } = props
  const { data: viewable } = usePermission(code)
  const { data: dataSource, isLoading } = useQuery({ queryKey, queryFn, enabled: viewable })

  return (
    <div>
      {queryFilterRender && <QueryFilter ref={ref}>{form => <>{queryFilterRender(form)}</>}</QueryFilter>}
      {viewable ? <Table columns={columns} dataSource={dataSource?.List} loading={isLoading} /> : <NoPermissionCover />}
    </div>
  )
}

// 必须搭配 @tanstack/react-query 使用的 Table 组件
export const QueryList = forwardRef(InternalQueryList) as <T, F>(
  props: QueryListProps<T, F> & { ref?: Ref<FormInstance<F>> },
) => React.ReactElement
