import Chat from "@/modules/chat/component/Chat"

interface ILayoutProps {
  children: React.ReactNode
}

export default function ChatLayout({ children }: ILayoutProps) {
  return (
    <>
      <div className="flex h-full w-1/3 flex-col border-r">
        <Chat />
      </div>
      <div className="flex w-full">{children}</div>
    </>
  )
}
