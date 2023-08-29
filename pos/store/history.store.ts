import { formatISO, subDays } from "date-fns"
import { atom } from "jotai"

import { IFilter } from "@/types/history.types"
import { ORDER_STATUSES } from "@/lib/constants"

export const defaultFilter = {
  searchValue: "",
  statuses: ORDER_STATUSES.ALL,
  customerId: "",
  startDate: formatISO(subDays(new Date(), 10)),
  endDate: formatISO(new Date()),
  isPaid: undefined,
  perPage: 10,
  page: 1,
  sortField: "createdAt",
  sortDirection: -1,
}

export const filterAtom = atom<IFilter>(defaultFilter)

export const detailIdAtom = atom<string | null>(null)
