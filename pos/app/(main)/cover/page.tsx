"use client"

import { useState } from "react"
import Link from "next/link"
import { useUsers } from "@/modules/auth/hooks/useUser"
import { useQuery } from "@apollo/client"
import { subDays } from "date-fns"
import { AlarmPlus } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { FacetedFilter } from "@/components/ui/faceted-filter"
import { Skeleton } from "@/components/ui/skeleton"

import DataTable from "./components/table"
import { queries } from "./graphql"

const Cover = () => {
  // const { users, loading } = useUsers()
  // const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 15),
    to: new Date(),
  })
  // const mappedUsers = users.map(({ _id, firstName, lastName, email }) => ({
  //   value: _id,
  //   label: firstName && lastName ? `${firstName} ${lastName}` : email || "",
  // }))
  const { data, loading: loadingCovers } = useQuery(queries.covers, {
    variables: {
      startDate: dateRange?.from,
      endDate: dateRange?.to,
    },
  })

  return (
    <div className="flex flex-auto flex-col px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <DatePickerWithRange
            toDate={new Date()}
            date={dateRange}
            setDate={setDateRange}
          />
          {/* {loading ? (
            <div className="flex h-10 items-center space-x-3 rounded-md border border-dashed px-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
          ) : (
            <FacetedFilter
              options={mappedUsers}
              title="Посын хэрэглэгчид"
              values={selectedUsers}
              onSelect={(values) => setSelectedUsers(values)}
            />
          )} */}
        </div>
        <Button Component={Link} href="/cover/create">
          <AlarmPlus className="mr-2 h-4 w-4" />
          Нэмэх
        </Button>
      </div>
      {!loadingCovers && <DataTable data={(data || {}).covers} />}
    </div>
  )
}

export default Cover
