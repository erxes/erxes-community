import { IUser } from "../auth/types"

export interface IEventData {
  where: string
  startDate: Date
  endDate: Date
  visibility: string
}

export interface IFeed {
  _id: string
  title: string
  description: string
  images: string
  attachments: string
  isPinned: boolean
  contentType: string
  recipientIds: string[]
  customFieldsData: string
  ceremonyData: string
  eventData: IEventData
  startDate: Date
  endDate: Date
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: Date
  department: string
  departmentIds?: string[]
  branchIds?: string[]
  unitId?: string
  createdUser?: IUser
}
