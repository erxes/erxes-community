"use client"

import { useSearchParams } from "next/navigation"
import Messages from "@/modules/messages/Messages"

export default function Detail() {
  const searchParams = useSearchParams()

  const id = searchParams.get("id") as string

  return <Messages id={id} />
}
