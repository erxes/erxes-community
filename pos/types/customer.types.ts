export type CustomerTypeT = "" | "user" | "company"

export interface CustomerT {
  _id: string
  code?: string
  primaryPhone?: string
  firstName?: string
  primaryEmail?: string
  lastName?: string
  email?: string
}
