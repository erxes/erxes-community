import { PaymentType } from "./payment.types"

export interface IConfig {
  _id: string
  name: string
  token: string
  cashierIds?: string[]
  adminIds?: string[]
  createdAt?: string
  uiOptions?: {
    colors: string
    logo: string
    favIcon: string
  }
}

export interface IPaymentType {
  type: string
  title: string
  config?: {
    [key: string]: string
    port: string
    notSplit: string
  }
}

export interface IPaymentConfig extends ICoverConfig {
  erxesAppToken: string
  permissionConfig?: {
    admins?: {
      isTempBill?: boolean
    }
    cashiers?: {
      isTempBill?: boolean
    }
  }
}
export interface ICoverConfig {
  paymentIds: string[]
  paymentTypes: IPaymentType[]
}

export interface IEbarimtConfig {
  ebarimtConfig: {
    footerText: string
    hasCopy: boolean
  }
  paymentTypes: IPaymentType[]
  uiOptions: {
    receiptIcon: string
  }
}

export interface ISettingsConfig {}

export interface ICurrentUser {
  _id: string
  createdAt?: string
  username?: string
  email?: string
  isOwner?: boolean
  details: {
    avatar?: null
    fullName?: string
    shortName?: string
    position?: string
    description?: string
    operatorPhone?: string
  }
}

export type modeT = "market" | "main" | "kiosk"
