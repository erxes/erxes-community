import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"

import { useToast } from "@/components/ui/use-toast"

import { mutations, queries } from "../graphql"

export interface IUseChats {
  loading: boolean
  loadingMutation: boolean
  chatId: string
  setChatUser: (userIds: string) => void
  startGroupChat: (name: string, userIds: string[]) => void
}

export const useChatId = (): IUseChats => {
  const { toast } = useToast()
  const [chatUser, setChatUser] = useState("")

  // const success = () =>
  //   toast({
  //     description: `${configType} has been synced successfully.`,
  //   })

  const { data, loading } = useQuery(queries.getChatIdByUserIds, {
    variables: { userIds: [chatUser] },
    skip: !chatUser,
  })

  const [chatAddMutation, { loading: loadingMutation }] = useMutation(
    mutations.chatAdd
  )

  const startGroupChat = (name: string, userIds: string[]) => {
    if (!name) {
      return toast({
        description: `Name is required!`,
      })
    }

    // if (userIds.length === 0) {
    //   return toast({
    //     description: `Select users!`,
    //   })
    // }

    chatAddMutation({
      variables: { name, type: "group", participantIds: userIds || [] },
      refetchQueries: ["chats"],
    })
      .then(() => {
        console.log("ok")
      })
      .catch((error) => {
        console.log("error")
      })
  }

  const chatId = (data || {}).getChatIdByUserIds
    ? (data || {}).getChatIdByUserIds
    : ""

  return {
    loading,
    loadingMutation,
    chatId,
    setChatUser,
    startGroupChat,
  }
}
