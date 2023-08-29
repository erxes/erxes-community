"use client"

import { useUsers } from "@/modules/auth/hooks/useUser"
import { defaultFilter, filterAtom } from "@/store/history.store"
import { zodResolver } from "@hookform/resolvers/zod"
import { formatISO, subDays } from "date-fns"
import { useAtom } from "jotai"
import { SearchIcon, XIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { IOrderStatus } from "@/types/order.types"
import { ORDER_STATUSES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { FacetedFilter } from "@/components/ui/faceted-filter"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const FormSchema = z.object({
  searchValue: z.string(),
  dateType: z.string().optional(),
  range: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional(),
  statuses: z.array(z.string()).optional(),
  customerType: z.string().optional(),
  customerId: z.string().nullable(),
  isPaid: z.boolean().optional(),
  sort: z.string().optional(),
})

const Filter = () => {
  const [filter, setFilter] = useAtom(filterAtom)

  const {
    searchValue,
    startDate,
    endDate,
    statuses,
    customerId,
    isPaid,
    sortField,
    sortDirection,
  } = defaultFilter

  const defaultValues = {
    searchValue,
    range: {
      from: new Date(startDate || defaultFilter.startDate),
      to: new Date(endDate || defaultFilter.startDate),
    },
    statuses,
    customerId: customerId || "empty_field",
    isPaid: typeof isPaid === "boolean" ? isPaid : undefined,
    sort:
      sortField && sortDirection
        ? sortField + (sortDirection === 1 ? "_asc" : "_desc")
        : "createdAt_asc",
  }

  const { users } = useUsers()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  })

  const onSubmit = ({
    searchValue,
    dateType,
    range,
    statuses,
    customerType,
    customerId,
    isPaid,
    sort,
  }: z.infer<typeof FormSchema>) => {
    const { from, to } = range || {}
    const sortField = sort?.split("_")[0]
    const sortDirection = sort?.split("_")[1] === "asc" ? 1 : -1
    setFilter({
      ...filter,
      page: 1,
      searchValue,
      statuses: (statuses || []) as IOrderStatus[],
      customerId: customerId === "empty_field" ? null : customerId,
      startDate: formatISO(new Date(from || subDays(new Date(), 10))),
      endDate: formatISO(new Date(to || new Date())),
      isPaid: typeof isPaid === "boolean" ? isPaid : undefined,
      sortField,
      sortDirection,
    })
  }

  return (
    <div className="px-4 py-3">
      <div className="text-sm font-semibold">Талбараар шүүх</div>
      <Form {...form}>
        <form
          className="mb-4 grid grid-cols-4 items-end gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="searchValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Хайх</FormLabel>
                <FormControl>
                  <Input placeholder="Хайх..." {...field} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Oгнооны хүрээ</FormLabel>
                <FormControl>
                  <DatePickerWithRange
                    date={field.value}
                    setDate={field.onChange}
                    toDate={new Date()}
                    className=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="statuses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Хайх</FormLabel>
                <FormControl>
                  <FacetedFilter
                    options={ORDER_STATUSES.ALL.map((status) => ({
                      label: status,
                      value: status,
                    }))}
                    title="Төлөвүүд"
                    values={field.value}
                    onSelect={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Хэрэглэгч сонгох</FormLabel>
                <FormControl>
                  <Select
                    value={field.value ? field.value : ""}
                    onValueChange={(value) => {
                      if (value === "empty_field") {
                        field.onChange(null)
                      } else {
                        field.onChange(value)
                      }
                    }}
                  >
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Хэрэглэгч сонгох" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="empty_field"
                        className="h-8"
                      ></SelectItem>

                      {users.map(({ _id, primaryEmail, email }) => (
                        <SelectItem value={_id} key={_id}>
                          {primaryEmail || email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ангилал сонгох</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Ангилал сонгох" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt_desc">
                        Сүүлд нэмэгдсэн
                      </SelectItem>
                      <SelectItem value="createdAt_asc">
                        Эхэлж нэмэгдсэн
                      </SelectItem>
                      <SelectItem value="modifiedAt_desc">
                        Сүүлд өөрчилсөн
                      </SelectItem>
                      <SelectItem value="modifiedAt_asc">
                        Эхэлж өөрчилсөн
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPaid"
            render={({ field }) => (
              <FormItem className="flex h-10 items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Төлбөр төлсөн эсэx</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            <SearchIcon className="h-5 w-5 mr-1" />
            Хайх
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              form.reset()
              setFilter(defaultFilter)
            }}
          >
            <XIcon className="h-5 w-5 mr-1" />
            Цэвэрлэх
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Filter
