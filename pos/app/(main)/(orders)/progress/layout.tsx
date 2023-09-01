import HeaderLayout from "@/components/header/headerLayout"

import FilterTrigger from "../components/progress/filterTrigger"

const HistoryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeaderLayout hideUser>
        <FilterTrigger />
      </HeaderLayout>
      <div className="flex-auto overflow-hidden">{children}</div>
    </>
  )
}

export default HistoryLayout
