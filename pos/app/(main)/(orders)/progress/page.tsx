"use client"

import { filterAtom, showFilterAtom } from "@/store/progress.store"
import { useAtom, useAtomValue } from "jotai"
import { ChevronsUpDownIcon, MoreVerticalIcon, StoreIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import Filter from "../components/filter"

const Progress = () => {
  const [filter, setFilter] = useAtom(filterAtom)
  const showFilter = useAtomValue(showFilterAtom)
  return (
    <div>
      <Collapsible open={showFilter}>
        <CollapsibleContent className="pt-3">
          <Filter filter={filter} setFilter={setFilter} />
        </CollapsibleContent>
      </Collapsible>
      <div className="mx-4 grid gap-3 grid-cols-3 mt-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="inline-flex items-end">
                <StoreIcon className="mr-1 h-6 w-6" />
                <span>
                  <span className="text-base">#0004</span>{" "}
                  <small className="text-slate-600 font-normal">20230630</small>
                </span>
              </div>
              <div className="inline-flex items-center">
                <Badge>reDoing</Badge>
                <Button variant="ghost" size="sm" className="-mr-1 px-2 ml-1">
                  <ChevronsUpDownIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export default Progress
