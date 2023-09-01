"use client"

import { atom } from "jotai"

import { CustomerT, CustomerTypeT } from "@/types/customer.types"
import {
  IBillType,
  IOrder,
  IOrderType,
  IOrderUser,
  IPaidAmount,
  IPutResponse,
} from "@/types/order.types"

import { customerSearchAtom } from "."
import { cartAtom } from "./cart.store"
import { paymentSheetAtom } from "./ui.store"

// order
export const activeOrderAtom = atom<string>("")
export const orderNumberAtom = atom<string>("")

// customer
export const customerAtom = atom<CustomerT | null>(null)
export const customerTypeAtom = atom<CustomerTypeT>("")

// order type
export const orderTypeAtom = atom<IOrderType>("eat")
export const setOrderTypeAtom = atom(
  () => "",
  (get, set, update: IOrderType) => {
    set(orderTypeAtom, update)
  }
)
// ebarimt
export const registerNumberAtom = atom<string>("")
export const setRegisterNumberAtom = atom(
  () => "",
  (get, set, update: string) => {
    set(registerNumberAtom, update)
  }
)
export const billTypeAtom = atom<IBillType>(null)
export const putResponsesAtom = atom<IPutResponse[]>([])
export const setPutResponsesAtom = atom(
  () => "",
  (get, set, update: IPutResponse[]) => {
    set(putResponsesAtom, update)
  }
)
export const printTypeAtom = atom<string | null>(null)

// slot
export const slotCodeAtom = atom<string | null>(null)

// delivery
export const deliveryInfoAtom = atom<object | null>(null)
export const setDeliveryInfoAtom = atom(
  () => "",
  (get, set, update: object) => {
    set(deliveryInfoAtom, update)
  }
)
// payment
export const orderTotalAmountAtom = atom<number>(0)
export const cashAmountAtom = atom<number>(0)
export const mobileAmountAtom = atom<number>(0)
export const paidAmountsAtom = atom<IPaidAmount[]>([])

export const getTotalPaidAmountAtom = atom(
  (get) =>
    get(paidAmountsAtom).reduce((total, item) => total + item.amount, 0) +
    get(cashAmountAtom) +
    get(mobileAmountAtom)
)
export const unPaidAmountAtom = atom(
  (get) => get(orderTotalAmountAtom) - get(getTotalPaidAmountAtom)
)
export const paidDateAtom = atom<string | null>(null)

// cashier
export const orderUserAtom = atom<IOrderUser | null>(null)

// reset
export const setInitialAtom = atom(
  () => "",
  (get, set) => {
    set(cartAtom, [])
    set(customerAtom, null)
    set(customerTypeAtom, "")
    set(orderTypeAtom, "eat")
    set(registerNumberAtom, "")
    set(billTypeAtom, null)
    set(slotCodeAtom, null)
    set(deliveryInfoAtom, null)
    set(activeOrderAtom, "")
    set(cashAmountAtom, 0)
    set(mobileAmountAtom, 0)
    set(paidAmountsAtom, [])
    set(paidDateAtom, null)
    set(putResponsesAtom, [])
    set(orderUserAtom, null)
    set(orderNumberAtom, "")
    set(paymentSheetAtom, false)
    set(customerSearchAtom, "")
  }
)

// set order states
export const setOrderStatesAtom = atom(
  () => "",
  (
    get,
    set,
    {
      _id,
      customer,
      customerType,
      items,
      type,
      billType,
      slotCode,
      deliveryInfo,
      cashAmount,
      mobileAmount,
      paidAmounts,
      totalAmount,
      paidDate,
      putResponses,
      user,
      number,
    }: IOrder
  ) => {
    set(activeOrderAtom, _id || "")
    set(customerAtom, customer || null)
    set(customerTypeAtom, customerType || "")
    set(cartAtom, items)
    set(orderTypeAtom, type || "eat")
    set(billTypeAtom, billType || "1")
    set(slotCodeAtom, slotCode || null)
    set(deliveryInfoAtom, deliveryInfo || null)
    set(cashAmountAtom, cashAmount || 0)
    set(mobileAmountAtom, mobileAmount || 0)
    set(paidAmountsAtom, paidAmounts || [])
    set(orderTotalAmountAtom, totalAmount || 0)
    set(paidDateAtom, paidDate || null)
    set(putResponsesAtom, putResponses || [])
    set(orderUserAtom, user || null)
    set(orderNumberAtom, number || "")
    set(customerSearchAtom, customer?.primaryPhone || customer?._id || "")
  }
)
