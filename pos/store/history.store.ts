import { atom } from "jotai"

import { IFilter } from "@/types/history.types"
import { ORDER_STATUSES } from "@/lib/constants"

export const filterAtom = atom<IFilter>({
  searchValue: undefined,
  statuses: ORDER_STATUSES.ALL,
  customerId: undefined,
  startDate: undefined,
  endDate: undefined,
  isPaid: undefined,
  perPage: 10,
  page: 1,
  sortField: undefined,
  sortDirection: undefined,
})
