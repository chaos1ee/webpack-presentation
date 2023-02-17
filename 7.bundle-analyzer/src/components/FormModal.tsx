import type { FormInstance, FormProps, ModalProps } from 'antd'
import { Button, Form, Modal } from 'antd'
import type { ComponentType, Ref } from 'react'
import React, { forwardRef, useEffect, useId } from 'react'
import { useTranslation } from 'react-i18next'

type RenderChildren<T> = (form: FormInstance<T>) => JSX.Element | JSX.Element[]
type ChildrenType<T> = RenderChildren<T> | JSX.Element | JSX.Element[]

interface FormModalProps<T> extends Pick<ModalProps, 'title' | 'open' | 'onCancel'> {
  initialValues?: FormProps<T>['initialValues']
  modalProps?: Omit<ModalProps, 'onCancel' | 'afterClose' | 'title' | 'open'>
  formProps?: Omit<FormProps<T>, 'initialValues' | 'onFinish' | 'form'>
  children?: ChildrenType<T>
  confirmLoading?: boolean
  onConfirm?: (values: T) => void
  onChange?: FormProps['onFieldsChange']
}

const InternalFormModal = <T extends object>(props: FormModalProps<T>, ref: Ref<FormInstance<T>>) => {
  const { children, title, open, initialValues, modalProps, formProps, confirmLoading, onCancel, onConfirm, onChange } =
    props
  const { t } = useTranslation()
  const id = useId()
  const [form] = Form.useForm<T>()
  const isRenderProps = typeof children === 'function'

  useEffect(() => {
    if (initialValues) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setFieldsValue(initialValues as any)
    }
  }, [initialValues, form])

  return (
    <Modal
      destroyOnClose
      open={open}
      title={title}
      forceRender={true}
      width={600}
      getContainer={false}
      footer={[
        <Button
          key="cancel"
          onClick={e => {
            onCancel?.(e as React.MouseEvent<HTMLButtonElement>)
          }}
        >
          {t('cancel')}
        </Button>,
        <Button form={id} key="submit" type="primary" loading={confirmLoading} htmlType="submit">
          {t('confirm')}
        </Button>,
      ]}
      afterClose={() => {
        form.resetFields()
      }}
      onCancel={onCancel}
      {...modalProps}
    >
      <Form
        ref={ref}
        id={id}
        preserve={false}
        autoComplete={'off'}
        labelAlign={'right'}
        labelWrap={true}
        form={form}
        onFinish={onConfirm}
        onFieldsChange={onChange}
        {...formProps}
      >
        {isRenderProps ? children(form) : children}
      </Form>
    </Modal>
  )
}

export const FormModal = forwardRef(InternalFormModal) as <T>(
  props: FormModalProps<T> & { ref?: Ref<FormInstance<T>> },
) => React.ReactElement

// TODO: 完成 hook
export function useFormModal(component: ComponentType) {
  return {}
}
