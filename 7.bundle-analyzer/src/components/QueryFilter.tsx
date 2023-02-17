import { SearchOutlined } from '@ant-design/icons'
import type { FormInstance } from 'antd'
import { Button, Form } from 'antd'
import type { FormProps } from 'antd/lib/form/Form'
import type { Ref } from 'react'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * TODO: 完成此组件。参考 https://github.com/ant-design/pro-components/blob/master/packages/form/src/layouts/QueryFilter/index.tsx
 * 1. 支持 展开/收起
 * 2. 响应式支持
 **/

type RenderChildren<T> = (form: FormInstance<T>) => JSX.Element | JSX.Element[]
type ChildrenType<T> = RenderChildren<T> | JSX.Element | JSX.Element[]

export interface QueryFilterProps<T> {
  initialValues?: FormProps['initialValues']
  children?: ChildrenType<T>
  onQuery?: (value: T) => void
}

const InternalQueryFilter = <T extends object>(props: QueryFilterProps<T>, ref: Ref<FormInstance<T>>) => {
  const { initialValues, children, onQuery } = props
  const { t } = useTranslation()
  const [form] = Form.useForm<T>()
  const isRenderProps = typeof children === 'function'

  return (
    <div className={'mb-8 flex'}>
      <div className="flex-1 mr-2">
        <Form
          style={{ width: '100%' }}
          ref={ref}
          id="queryForm"
          form={form}
          layout={'inline'}
          autoComplete="off"
          initialValues={initialValues}
          onFinish={values => {
            onQuery?.(values)
          }}
        >
          {isRenderProps ? children(form) : children}
        </Form>
      </div>
      <div>
        <Button type={'primary'} form="queryForm" htmlType={'submit'} icon={<SearchOutlined />}>
          {t('search')}
        </Button>
        <Button htmlType="reset" form="queryForm">
          {t('reset')}
        </Button>
      </div>
    </div>
  )
}

export const QueryFilter = forwardRef(InternalQueryFilter) as <T>(
  props: QueryFilterProps<T> & { ref?: Ref<FormInstance<T>> },
) => React.ReactElement
