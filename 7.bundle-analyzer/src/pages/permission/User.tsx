import { UserAddOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { FormInstance, TableColumnsType } from 'antd'
import { App, Card, Form, Input, Select, Space, Table, Tag, message } from 'antd'
import type { FC } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FormModal, NoPermissionCover, TooltipButton } from '~/components'
import type { UserListItem } from '~/features/permission'
import { permission, useAllRoles } from '~/features/permission'
import { createUser, deleteUser, updateUser } from '~/features/permission/services'
import { usePermissions } from '~/hooks'

const { Option } = Select

const User: FC = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const formRef = useRef<FormInstance>(null)
  const { modal } = App.useApp()

  const { permissions, isLoading: isChecking } = usePermissions({
    listable: '100001',
    creatable: '100002',
    updatable: '100003',
    deletable: '100004',
    listAllRole: '200006',
  })

  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, size: 10 })

  const queryClient = useQueryClient()

  const { roles, isLoading: isRolesLoading } = useAllRoles()

  const { data } = useQuery({ ...permission.userList(pagination), enabled: !!permissions?.listable })

  const deleteMutation = useMutation(deleteUser, {
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: permission.userList._def })
      message.success(t('permission:delete_user_successfully'))
    },
    onError() {
      message.error(t('permission:delete_user_failed'))
    },
  })

  const createMutation = useMutation(createUser, {
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: permission.userList._def })
    },
  })

  const updateMutation = useMutation(updateUser, {
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: permission.userList._def })
    },
  })

  const columns: TableColumnsType<UserListItem> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('role'),
      dataIndex: 'roles',
      key: 'roles',
      render(value: string[]) {
        return (
          <>
            {(value || []).map((item: string) =>
              item === 'root' ? (
                <Tag key={item} color="#f50">
                  {item}
                </Tag>
              ) : (
                <Tag key={item} color="#ff5a00">
                  <Link to={`/permission/role/${item}`}>{item}</Link>
                </Tag>
              ),
            )}
          </>
        )
      },
    },
    {
      title: t('creation_time'),
      dataIndex: 'ctime',
      key: 'ctime',
      width: 200,
    },
    {
      title: t('action'),
      width: 150,
      align: 'center',
      render: (value: UserListItem) => (
        <Space>
          <TooltipButton
            size="small"
            type="link"
            disabled={!permissions?.updatable}
            onClick={() => {
              formRef.current?.setFieldsValue({ id: value.id, name: value.name, roles: value.roles })
              setOpen(true)
            }}
          >
            {t('update')}
          </TooltipButton>
          <TooltipButton
            danger
            size="small"
            disabled={!permissions?.deletable}
            type="link"
            onClick={() => {
              modal.confirm({
                title: t('permission:delete_user'),
                content: (
                  <div
                    dangerouslySetInnerHTML={{ __html: t('permission:delete_user_message', { name: value.name }) }}
                  />
                ),
                cancelText: t('cancel'),
                okText: t('confirm'),
                onOk: () => {
                  deleteMutation.mutate({
                    id: value.id,
                    name: value.name,
                  })
                },
              })
            }}
          >
            {t('delete')}
          </TooltipButton>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card
        title={t('nav:user')}
        extra={
          <TooltipButton
            type="primary"
            icon={<UserAddOutlined />}
            disabled={!permissions?.creatable}
            loading={isChecking}
            onClick={() => {
              setOpen(true)
            }}
          >
            {t('permission:create_user')}
          </TooltipButton>
        }
      >
        {!isChecking &&
          (permissions?.listable ? (
            <Table
              tableLayout="fixed"
              rowKey="id"
              dataSource={data?.List}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                total: data?.Total,
                current: pagination?.page,
                pageSize: pagination?.size,
                onChange: async (currentPage, currentSize) => {
                  setPagination({ page: currentPage, size: currentSize })
                },
              }}
            />
          ) : (
            <NoPermissionCover />
          ))}
      </Card>
      <FormModal
        ref={formRef}
        open={open}
        title={formRef.current?.getFieldValue('id') ? t('permission:update_user') : t('permission:create_user')}
        formProps={{ labelCol: { flex: '80px' } }}
        onCancel={() => {
          setOpen(false)
        }}
        onConfirm={(values: { id: string; name: string; roles: string[] }) => {
          if (values.id) {
            updateMutation.mutate(values)
          } else {
            createMutation.mutate(values)
          }
          setOpen(false)
        }}
      >
        <Form.Item hidden name={'id'}>
          <Input />
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prevValues, currentValue) => prevValues.type !== currentValue.type}>
          {({ getFieldValue }) => (
            <Form.Item label={t('name')} name="name" rules={[{ required: true }]}>
              <Input disabled={getFieldValue('id')} />
            </Form.Item>
          )}
        </Form.Item>
        <Form.Item label={t('role')} name="roles">
          <Select allowClear mode="multiple" loading={isRolesLoading}>
            {(roles ?? []).map(role => (
              <Option value={role.name} key={role.id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </FormModal>
    </>
  )
}

export default User
