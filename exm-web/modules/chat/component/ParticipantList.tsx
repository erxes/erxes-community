"use client"

import { currentUserAtom } from "@/modules/JotaiProiveder"
import { IUser } from "@/modules/auth/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAtomValue } from "jotai"
import { PlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import useChatsMutation from "../hooks/useChatsMutation"
import { IChat } from "../types"
import ParticipantItem from "./ParticipantItem"

const FormSchema = z.object({
  title: z.string({
    required_error: "Please enter an title",
  }),
  description: z.string().optional(),
  recipientIds: z.array(z.string()).optional(),
})

const ParticipantList = ({ chat }: { chat: IChat }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const currentUser = useAtomValue(currentUserAtom) || ({} as IUser)

  const { makeOrRemoveAdmin, addOrRemoveMember } = useChatsMutation()

  const isAdmin =
    (chat?.participantUsers || []).find(
      (pUser) => pUser._id === currentUser._id
    )?.isAdmin || false

  const renderAdd = () => {
    const renderForm = () => {
      return (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create bravo</DialogTitle>
          </DialogHeader>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create bravo</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                className="space-y-3"
                // onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="recipientIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choose one</FormLabel>
                      {/* <FormControl>
                        {loading ? (
                          <Input disabled={true} placeholder="Loading..." />
                        ) : (
                          <FacetedFilter
                            options={(users || []).map((user: any) => ({
                              label: user?.details?.fullName || user.email,
                              value: user._id,
                            }))}
                            title="Users"
                            values={field.value}
                            onSelect={field.onChange}
                          />
                        )}
                      </FormControl> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="font-semibold w-full rounded-full"
                >
                  Add
                </Button>
              </form>
            </Form>
          </DialogContent>
        </DialogContent>
      )
    }

    return (
      <Dialog>
        <DialogTrigger asChild={true}>
          <div className="flex items-center mb-2 p-2 hover:bg-[#F0F0F0] cursor-pointer">
            <div className="p-2 bg-[#F0F0F0] rounded-full cursor-pointer mr-2">
              <PlusIcon size={18} />
            </div>
            <div className="">
              <p className="text-sm font-medium text-[#444]">Add member</p>
            </div>
          </div>
        </DialogTrigger>

        {renderForm()}
      </Dialog>
    )
  }

  return (
    <div className="mt-4">
      {chat.participantUsers.map((user: any, index: number) => (
        <ParticipantItem
          key={index}
          participant={user}
          chatId={chat._id}
          isAdmin={isAdmin}
        />
      ))}

      {isAdmin && renderAdd()}
    </div>
  )
}

export default ParticipantList
