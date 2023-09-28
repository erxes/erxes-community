"use client"

import { useState } from "react"
import { useQuery } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import Uploader from "@/components/uploader/Uploader"

import { queries } from "../../graphql"
import useFeedMutation from "../../hooks/useFeedMutation"
import { IFeed } from "../../types"

const FormSchema = z.object({
  title: z.string({
    required_error: "Please enter an title",
  }),
  description: z.string().optional(),
  departmentIds: z.array(z.string()).optional(),
  branchIds: z.array(z.string()).optional(),
  unitId: z.string().optional(),
})

const PostForm = ({ feed }: { feed?: IFeed }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const { feedMutation } = useFeedMutation()

  const [images, setImage] = useState(feed?.images || [])

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    feedMutation(
      {
        title: data.title,
        description: data.description ? data.description : null,
        contentType: "post",
        images,
        departmentIds: data.departmentIds,
        branchIds: data.branchIds,
        unitId: data.unitId,
      },
      feed?._id || ""
    )
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create post</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="title"
                    {...field}
                    defaultValue={feed?.title || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="description"
                    {...field}
                    defaultValue={feed?.description || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departmentIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departments</FormLabel>
                <FormControl>
                  {loadingDepartments ? (
                    <Input disabled={true} placeholder="Loading..." />
                  ) : (
                    <FacetedFilter
                      options={(departments || []).map((department: any) => ({
                        label: department.title,
                        value: department._id,
                      }))}
                      title="Departments"
                      values={field.value}
                      onSelect={field.onChange}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="branchIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branches</FormLabel>
                <FormControl>
                  {loadingBranches ? (
                    <Input disabled={true} placeholder="Loading..." />
                  ) : (
                    <FacetedFilter
                      options={(branches || []).map((branch: any) => ({
                        label: branch.title,
                        value: branch._id,
                      }))}
                      title="Branches"
                      values={feed?.branchIds || field.value}
                      onSelect={field.onChange}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  {loadingUnits ? (
                    <Input disabled={true} placeholder="Loading..." />
                  ) : (
                    <Select
                      value={feed?.unitId || field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="сонгох" />
                      </SelectTrigger>
                      <SelectContent>
                        {(unitsMain?.list || []).map((unit: any) => (
                          <SelectItem key={unit._id} value={unit._id}>
                            {unit.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Uploader
            defaultFileList={images || []}
            onChange={setImage}
            multiple={true}
          />

          <Button type="submit" className="font-semibold w-full rounded-full">
            Post
          </Button>
        </form>
      </Form>
    </DialogContent>
  )
}

export default PostForm
