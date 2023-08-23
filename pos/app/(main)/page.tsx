'use client'
import dynamic from "next/dynamic"

import { getMode } from "@/lib/utils"

const Market = dynamic(() => import("@/app/(main)/market"))
const Main = dynamic(() => import("@/app/(main)/main"))

export default function IndexPage() {
  const mode = getMode()
  return (
    <>
      {mode === "market" && <Market />}
      {mode === "main" && <Main />}
    </>
  )
}
