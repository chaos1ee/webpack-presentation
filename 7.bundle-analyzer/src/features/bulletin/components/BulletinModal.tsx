import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, DatePicker, Divider, Form, Input, InputNumber, Space } from 'antd'
import type { Dayjs } from 'dayjs'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { FormModal } from '~/components'
import type { Bulletin, BulletinContent } from '../services'

export interface BulletinModalProps {
  open?: boolean
  close?: VoidFunction
  onSubmit?: (values: Bulletin) => void
}

interface FormModel {
  id: string
  data: {
    lang: string
    title: string
    content: string
    backgroundImage: string
    address: string
    items: {
      name: string
      amount: number
    }[]
  }[]
  startTime: Dayjs
  endTime: Dayjs
}

const transformData = (model: FormModel) => {
  const { id, startTime, endTime, data } = model

  return {
    ID: id,
    Constraint: {
      StartTime: startTime?.unix(),
      EndTime: endTime?.unix(),
    },
    I18nData: data.reduce((acc, curr) => {
      const { lang, title, content, backgroundImage, address, items } = curr
      acc[lang] = {
        Title: title,
        Content: content,
        BackgroundImg: backgroundImage,
        GotoURL: address,
        Items: items.reduce((innerAcc, innerCurr) => {
          innerAcc[innerCurr.name] = innerCurr.amount
          return innerAcc
        }, {} as Record<string, number>),
      }
      return acc
    }, {} as Record<string, BulletinContent>),
  }
}

export const BulletinModal: FC<BulletinModalProps> = props => {
  const { open, close, onSubmit } = props
  const { t } = useTranslation()

  return (
    <FormModal
      open={open}
      title={t('add_bulletin')}
      initialValues={{
        data: [
          {
            lang: '',
            title: '',
            content: '',
            backgroundImage: '',
            address: '',
            items: [],
          },
        ],
      }}
      formProps={{
        labelAlign: 'right',
        labelCol: { flex: '100px' },
      }}
      onCancel={close}
      onConfirm={(values: FormModel) => {
        if (values) {
          onSubmit?.(transformData(values))
        }
      }}
    >
      <Form.Item label="ID" name="id">
        <Input />
      </Form.Item>
      <Form.List name="data">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key}>
                <div className={'w-full flex items-center'}>
                  <div className={'flex-1'}>
                    <Form.Item
                      name={[field.name, 'lang']}
                      label={t('language')}
                      rules={[{ required: index !== 0 }]}
                      hidden={index === 0}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item name={[field.name, 'title']} label={t('title')} rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name={[field.name, 'content']} label={t('content')} rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, 'backgroundImage']}
                      label={t('background_image')}
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item name={[field.name, 'address']} label={t('address')} rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.List name={[field.name, 'items']}>
                      {(innerFields, { add: innerAdd, remove: innerRemove }) => (
                        <Form.Item label={t('item')}>
                          {innerFields.map(innerField => (
                            <Space key={innerField.key} align="baseline">
                              <Form.Item
                                labelAlign="left"
                                name={[innerField.name, 'name']}
                                label={t('name')}
                                rules={[{ required: true }]}
                              >
                                <Input />
                              </Form.Item>
                              <Form.Item
                                labelAlign="left"
                                name={[innerField.name, 'amount']}
                                label={t('amount')}
                                rules={[{ required: true }]}
                              >
                                <InputNumber min={0} />
                              </Form.Item>
                              <MinusCircleOutlined onClick={() => innerRemove(innerField.name)} />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              block
                              type="dashed"
                              htmlType={'button'}
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={() => innerAdd()}
                            >
                              {t('add')}
                            </Button>
                          </Form.Item>
                        </Form.Item>
                      )}
                    </Form.List>
                  </div>
                  <div className={`flex justify-center w-10 ${index === 0 && 'invisible'}`}>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </div>
                </div>
                {index !== fields.length - 1 && <Divider dashed />}
              </div>
            ))}
            <Form.Item>
              <Button
                block
                type="dashed"
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
      <Form.Item label={t('start_time')} name="startTime">
        <DatePicker showTime allowClear />
      </Form.Item>
      <Form.Item label={t('end_time')} name="endTime">
        <DatePicker showTime allowClear />
      </Form.Item>
    </FormModal>
  )
}
