import { Form, Input } from 'antd'
import type { FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'
import { FormModal } from '~/components'
import { createRole, updateRole } from '~/features/permission/services'
import { PermissionList } from './PermissionList'

export interface RoleFormModel {
  id: number
  name: string
  permissions: string[]
}

export interface RoleModalProps {
  open?: boolean
  close?: VoidFunction
  onChange?: VoidFunction
  value?: RoleFormModel | null
  isUpdate?: boolean
}

export const RoleModal: FunctionComponent<RoleModalProps> = props => {
  const { open, value, isUpdate, close, onChange } = props
  const { t } = useTranslation()

  const onFinish = async (model: RoleFormModel) => {
    if (isUpdate) {
      await updateRole({
        id: model.id,
        name: `role_${model.name}`,
        permissions: model.permissions,
      })
    } else {
      await createRole({
        name: `role_${model.name}`,
        permissions: model.permissions,
      })
    }
    onChange?.()
    close?.()
  }

  return (
    <FormModal
      open={open}
      title={isUpdate ? t('permission:update_role') : t('permission:create_role')}
      modalProps={{ width: 800 }}
      formProps={{ layout: 'vertical' }}
      initialValues={{
        id: value?.id,
        name: value?.name,
        permissions: value?.permissions,
      }}
      onCancel={close}
      onConfirm={onFinish}
    >
      <Form.Item hidden label="ID" name="id">
        <Input />
      </Form.Item>
      <Form.Item label={t('name')} name="name" rules={[{ required: true }]}>
        <Input addonBefore="role_" readOnly={isUpdate} />
      </Form.Item>
      <Form.Item label={t('permission')} name="permissions">
        <PermissionList />
      </Form.Item>
    </FormModal>
  )
}

RoleModal.defaultProps = {
  isUpdate: false,
  open: false,
}
