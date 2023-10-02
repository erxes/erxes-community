import ChatList from "@/modules/chat/component/ChatList"
import RightSideBar from "@/modules/chat/component/RightSideBar"

interface ILayoutProps {
  children: React.ReactNode
}

export default function ChatLayout({ children }: ILayoutProps) {
  return (
    <>
      <div className="flex h-full w-1/3 flex-col border-r">
        <ChatList />
      </div>
      {children}
      <div className="flex h-full w-1/3 flex-col border-r">
        <RightSideBar />
      </div>
    </>
  )
}
