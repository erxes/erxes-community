"use client"

import { showFilterAtom } from "@/store/progress.store"
import { useAtom } from "jotai"
import { ChevronsUpDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

const FilterTrigger = () => {
  const [showFilter, changeShowFilter] = useAtom(showFilterAtom)
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => changeShowFilter(!showFilter)}
    >
      <ChevronsUpDownIcon className="h-4 w-4 mr-1 -ml-1" />
      Шүүх
    </Button>
  )
}

export default FilterTrigger
