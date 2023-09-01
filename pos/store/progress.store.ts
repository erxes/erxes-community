"use client"

import { atom } from "jotai"

import { IFilter } from "@/types/history.types"

import { defaultFilter } from "./history.store"

export const filterAtom = atom<IFilter>(defaultFilter)

export const showFilterAtom = atom(false)
