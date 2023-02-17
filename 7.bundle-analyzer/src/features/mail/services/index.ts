import { request } from '~/libs/request'

export interface MailListItem {
  ID: number
  Title: string
  Items?: MailItem[]
}

export interface MailItem {
  ItemId: number
  ItemCount: number
}

export function getMailList(params?: { PlayerId?: number }) {
  return request.post<ListResponse<MailListItem>>('/mail/get', params)
}

export function sendMail(params: {
  SendType: 0 | 1 | 2
  Ids: number[]
  MailInfo: {
    Title: string
    SubjectTitle: string
    Content: string
    Items: MailItem[]
  }
}) {
  return request.post('/mail/send', params)
}
