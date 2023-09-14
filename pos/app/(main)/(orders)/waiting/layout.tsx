import Link from "next/link"
import { Hourglass } from "lucide-react"

import HeaderLayout from "@/components/header/headerLayout"

const HistoryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeaderLayout>
        <Link
          className="inline-flex items-end text-sm font-semibold"
          href={"/cover"}
        >
          <Hourglass className="mr-1" />
          Хүлээлгийн дэлгэц
        </Link>
      </HeaderLayout>
      <div className="flex-auto overflow-hidden">{children}</div>
    </>
  )
}

export default HistoryLayout
