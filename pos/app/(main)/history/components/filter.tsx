"use client"

import { useUsers } from "@/modules/auth/hooks/useUser"
import { filterAtom } from "@/store/history.store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom } from "jotai"
import { useForm } from "react-hook-form"
import * as z from "zod"

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

const FormSchema = z.object({
  search: z.string().optional(),
  dateType: z.string().optional(),
  range: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional(),
  status: z.array(z.string()).optional(),
  customerType: z.string().optional(),
  customerId: z.string().optional(),
  isPaid: z.boolean().optional(),
  sort: z.string().optional(),
})

const Filter = () => {
  const [values, setFilter] = useAtom(filterAtom)

  const { users } = useUsers()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values,
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => console.log(data)

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
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Хайх</FormLabel>
                <FormControl>
                  <Input placeholder="Хайх..." {...field} />
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
            name="status"
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Хэрэглэгч сонгох" />
                    </SelectTrigger>
                    <SelectContent>
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
                      <SelectItem value="createdAt_asc">
                        Сүүлд нэмэгдсэн
                      </SelectItem>
                      <SelectItem value="createdAt_desc">
                        Эхэлж нэмэгдсэн
                      </SelectItem>
                      <SelectItem value="modifiedAt_asc">
                        Сүүлд өөрчилсөн
                      </SelectItem>
                      <SelectItem value="modifiedAt_desc">
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
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Төлбөр төлсөн эсэx</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={"secondary"}>
            Шүүх
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Filter
