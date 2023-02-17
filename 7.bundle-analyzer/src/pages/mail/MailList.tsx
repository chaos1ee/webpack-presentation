import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Form, Input, InputNumber, Radio, Table, Typography } from 'antd'
import { toArray } from 'lodash-es'
import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormModal } from '~/components'
import type { MailListItem } from '~/features/mail'
import { getMailList, sendMail } from '~/features/mail'
import { PURE_NUMBER } from '~/rules'

const { Text } = Typography

const MailList: FC = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<MailListItem[]>([])
  const [open, setOpen] = useState(false)

  const columns = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'ID',
    },
    {
      key: 'title',
      title: t('title'),
      dataIndex: 'Title',
    },
  ]

  const onFinish = async () => {
    await fetchList()
  }

  const fetchList = async () => {
    try {
      const values = form.getFieldsValue()
      const { List } = await getMailList({ PlayerId: +values.id })
      setDataSource(List)
    } catch (_) {
      setDataSource([])
    }
  }

  return (
    <Card
      title={t('mail')}
      extra={
        <Button
          type={'primary'}
          onClick={() => {
            setOpen(true)
          }}
        >
          {t('send_mail')}
        </Button>
      }
    >
      <Form form={form} layout={'inline'} className={'mb-8'} autoComplete={'off'} onFinish={onFinish}>
        <Form.Item label={t('player_id')} name={'id'} rules={[{ required: true }, PURE_NUMBER]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type={'primary'} htmlType={'submit'}>
            {t('query')}
          </Button>
        </Form.Item>
      </Form>
      <Table
        rowKey={'ID'}
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        expandable={{
          expandedRowRender: record => {
            return (
              <Table
                title={() => (
                  <div className={'flex justify-center'}>
                    <Text strong>{'邮件附件'}</Text>
                  </div>
                )}
                rowKey={'ItemId'}
                dataSource={record.Items}
                columns={[
                  {
                    key: 'id',
                    title: 'ID',
                    dataIndex: 'ItemId',
                  },
                  {
                    key: 'id',
                    title: t('amount') as string,
                    dataIndex: 'ItemCount',
                  },
                ]}
                pagination={false}
              ></Table>
            )
          },
          rowExpandable: record => toArray(record.Items).length > 0,
        }}
      />
      <FormModal
        title={t('send_mail')}
        open={open}
        initialValues={{
          type: 0,
        }}
        formProps={{
          labelCol: { flex: '80px' },
          labelAlign: 'right',
        }}
        onCancel={() => {
          setOpen(false)
        }}
        onConfirm={async ({
          type,
          id,
          title,
          subtitle,
          content,
          items,
        }: {
          type: 0 | 1 | 2
          id: string
          title: string
          subtitle: string
          content: string
          items?: {
            id: number
            amount: number
          }[]
        }) => {
          await sendMail({
            SendType: type,
            Ids: (id ?? '')
              .split('\n')
              .filter(item => !!Number(item))
              .map(item => Number(item.trim())),
            MailInfo: {
              Title: title,
              SubjectTitle: subtitle,
              Content: content,
              Items: (items ?? []).map(item => ({ ItemId: item.id, ItemCount: item.amount })),
            },
          })
          form.submit()
          setOpen(false)
        }}
      >
        <Form.Item label={t('type')} name={'type'} rules={[{ required: true }]}>
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={0}>{t('player')}</Radio.Button>
            <Radio.Button value={1}>{t('kingdom')}</Radio.Button>
            <Radio.Button value={2}>{t('alliance')}</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={'ID'} name={'id'} rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label={t('title')} name={'title'} rules={[{ required: true, type: 'string' as const }]}>
          <Input />
        </Form.Item>
        <Form.Item label={t('subtitle')} name={'subtitle'} rules={[{ required: true, type: 'string' as const }]}>
          <Input />
        </Form.Item>
        <Form.Item label={t('content')} name={'content'} rules={[{ required: true, type: 'string' as const }]}>
          <Input.TextArea rows={5} />
        </Form.Item>
        <Divider dashed>{t('attachment')}</Divider>
        <Form.List name={'items'}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(field => (
                <div key={field.key} className={'w-full flex items-center'}>
                  <div className={'flex-1'}>
                    <Form.Item name={[field.name, 'id']} label={'ID'} rules={[{ required: true }, PURE_NUMBER]}>
                      <InputNumber className={'w-full'} />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, 'amount']}
                      label={t('amount')}
                      rules={[{ required: true }, { type: 'number' as const }]}
                    >
                      <InputNumber min={0} className={'w-full'} />
                    </Form.Item>
                  </div>
                  <div className={'flex justify-center w-10'}>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </div>
                </div>
              ))}
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType={'button'}
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => add()}
                >
                  {t('add')}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </FormModal>
    </Card>
  )
}

export default MailList
