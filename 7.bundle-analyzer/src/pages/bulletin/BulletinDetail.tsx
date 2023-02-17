import { useQuery } from '@tanstack/react-query'
import type { TableColumnsType } from 'antd'
import { Breadcrumb, Card, Descriptions, Skeleton, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import { Translation, useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import type { Merge } from 'ts-essentials'
import type { BulletinContent } from '~/features/bulletin'
import { getBulletin } from '~/features/bulletin'

type DataSourceType = Merge<
  Omit<BulletinContent, 'Items'>,
  {
    Lang: string
    Name: string
    Amount: number
    RowSpan: number
    key: React.Key
  }
>

const sharedOnCell = (record: DataSourceType) => {
  return {
    rowSpan: record.RowSpan,
  }
}

const columns: TableColumnsType<DataSourceType> = [
  {
    key: 'language',
    title: <Translation>{t => t('language')}</Translation>,
    dataIndex: 'Lang',
    render(value: string) {
      return <Translation>{t => (value ? value : t('default'))}</Translation>
    },
    onCell: sharedOnCell,
  },
  {
    key: 'title',
    title: <Translation>{t => t('title')}</Translation>,
    dataIndex: 'Title',
    onCell: sharedOnCell,
  },
  {
    key: 'content',
    title: <Translation>{t => t('content')}</Translation>,
    dataIndex: 'Content',
    width: '30%',
    render(value: string) {
      return <Typography.Paragraph>{value}</Typography.Paragraph>
    },
    onCell: sharedOnCell,
  },
  {
    key: 'background_image',
    title: <Translation>{t => t('background_image')}</Translation>,
    dataIndex: 'BackgroundImg',
    onCell: sharedOnCell,
  },
  {
    key: 'address',
    title: <Translation>{t => t('address')}</Translation>,
    dataIndex: 'GotoURL',
    render(value: string) {
      return (
        <Typography.Link href={value} target="_blank">
          {value}
        </Typography.Link>
      )
    },
    onCell: sharedOnCell,
  },
  {
    title: <Translation>{t => t('reward')}</Translation>,
    children: [
      {
        key: 'item',
        title: <Translation>{t => t('item')}</Translation>,
        dataIndex: 'Name',
      },
      {
        key: 'amount',
        title: <Translation>{t => t('amount')}</Translation>,
        dataIndex: 'Amount',
      },
    ],
  },
]

const BulletinDetail = () => {
  const { t } = useTranslation()
  const params = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['bulletin_detail'],
    queryFn: () => getBulletin(params.id as string),
    enabled: !!params.id,
  })

  function mapDataSource(value?: Record<string, BulletinContent>) {
    if (typeof value !== 'object') {
      return []
    }

    return Object.entries(value).reduce((acc, [Lang, item]) => {
      const { Items, ...restProps } = item

      Object.keys(item.Items).forEach((key, index, thisArray) => {
        acc.push({
          ...restProps,
          Lang,
          Name: key,
          Amount: item.Items[key],
          RowSpan: index === 0 ? thisArray.length : 0,
          key: `${Lang}-${index}`,
        })
      })

      return acc
    }, [] as DataSourceType[])
  }

  return (
    <>
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>
          <Link to={'/bulletin'}>{t('nav:bulletin')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{params.id}</Breadcrumb.Item>
      </Breadcrumb>
      <Card title={t('bulletin_detail')}>
        <Skeleton loading={isLoading}>
          <Descriptions bordered column={3} layout="vertical">
            <Descriptions.Item label="ID">{data?.ID}</Descriptions.Item>
            <Descriptions.Item label={t('start_time')}>
              {data?.Constraint.StartTime && dayjs.unix(data?.Constraint.StartTime).format('YYYY-MM-DD hh:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label={t('end_time')}>
              {data?.Constraint.EndTime && dayjs.unix(data?.Constraint.EndTime).format('YYYY-MM-DD hh:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item span={3} label={t('content')}>
              <Table
                bordered
                className="w-full"
                columns={columns}
                dataSource={mapDataSource(data?.I18nData)}
                pagination={false}
              />
            </Descriptions.Item>
          </Descriptions>
        </Skeleton>
      </Card>
    </>
  )
}

export default BulletinDetail
