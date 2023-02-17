import { request } from '~/libs/request'

export interface BulletinContent {
  Title: string
  Content: string
  BackgroundImg: string
  GotoURL: string
  Items: Record<string, number>
}

export interface Bulletin {
  ID: string
  Constraint: {
    StartTime: number
    EndTime: number
  }
  I18nData: Record<string, BulletinContent>
}

export function getBulletinList(pagination?: PaginationParams) {
  return request.get<ListResponse<Bulletin>>('/bulletin/list', { params: { ...pagination } })
}

export function getBulletin(ID: string) {
  return request.get<Bulletin>('/bulletin/get', { params: { ID } })
}

export function addBulletin(data: Bulletin) {
  return request.post('/bulletin/add', data)
}
