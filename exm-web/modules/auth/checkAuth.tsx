"use client"

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAtomValue } from "jotai"
import { Loader2 } from "lucide-react"

import { currentUserAtom } from "../JotaiProiveder"

const CheckAuth = ({ children }: any) => {
  const currentUser = useAtomValue(currentUserAtom)

  const pathname = usePathname()
  const router = useRouter()
  const LOGIN = "/login"

  useEffect(() => {
    if (!currentUser && pathname !== LOGIN) {
      router.push(LOGIN)
      return
    }

    if (currentUser && pathname === LOGIN) {
      router.push("/")
    }
  }, [currentUser, pathname])

  if (!currentUser && pathname === LOGIN) {
    return <>{children}</>
  }

  if (currentUser || pathname === LOGIN) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen  items-center justify-center">
      <Loader2 className="mr-2 animate-spin" /> Уншиж байна...
    </div>
  )
}

export default CheckAuth
