// config

import { atom } from "jotai"

import {
  IConfig,
  ICoverConfig,
  ICurrentUser,
  IEbarimtConfig,
  IPaymentConfig,
} from "@/types/config.types"

export const configAtom = atom<IConfig | null>(null)

export const paymentConfigAtom = atom<IPaymentConfig | null>(null)
export const ebarimtConfigAtom = atom<IEbarimtConfig | null>(null)
export const setEbarimtConfigAtom = atom(
  null,
  (get, set, update: IEbarimtConfig) => {
    set(ebarimtConfigAtom, update)
  }
)
export const coverConfigAtom = atom<ICoverConfig | null>(null)

export const setCoverConfigAtom = atom(
  null,
  (get, set, update: ICoverConfig) => {
    set(coverConfigAtom, update)
  }
)

export const configsAtom = atom<IConfig[] | null>(null)
export const setConfigsAtom = atom(null, (get, set, update: IConfig[]) => {
  set(configsAtom, update)
})
export const currentUserAtom = atom<ICurrentUser | null>(null)
export const setCurrentUserAtom = atom(
  null,
  (get, set, update: ICurrentUser | null) => {
    set(currentUserAtom, update)
  }
)
// 86614853
