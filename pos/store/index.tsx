"use client"

import { Provider, atom } from "jotai"

// products
export const searchAtom = atom<string>("")
export const activeCategoryAtom = atom<string>("")

// local
export const currentAmountAtom = atom<number>(0)

export const currentPaymentTypeAtom = atom<string>("cash")

export const customerSearchAtom = atom<string>("")

const JotaiProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>
}

export default JotaiProvider
