import { useQuery } from '@tanstack/react-query'
import { Breadcrumb, Card, Descriptions, Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { PermissionList } from '~/features/permission'
import { getRoleInfo } from '~/features/permission/services'

const RoleDetail = () => {
  const params = useParams()
  const { t } = useTranslation()

  const { data, isLoading } = useQuery({
    queryKey: ['role', params.name],
    queryFn: ({ queryKey }) => getRoleInfo({ name: queryKey[1] as string }),
  })

  return (
    <>
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>
          <Link to={'/permission/role'}>{t('role')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{params.name}</Breadcrumb.Item>
      </Breadcrumb>
      <Card title={t('permission:role_detail')}>
        <Skeleton loading={isLoading}>
          <Descriptions column={3} layout="vertical">
            <Descriptions.Item label={t('name')}>{data?.name}</Descriptions.Item>
            <Descriptions.Item label="ID">{data?.id}</Descriptions.Item>
            <Descriptions.Item label={t('creation_time')}>{data?.ctime}</Descriptions.Item>
            <Descriptions.Item label={t('permission')} span={3}>
              <PermissionList readonly value={data?.permissions} />
            </Descriptions.Item>
          </Descriptions>
        </Skeleton>
      </Card>
    </>
  )
}

export default RoleDetail
