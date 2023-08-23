import { ScrollArea } from "@/components/ui/scroll-area"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-auto items-center justify-center bg-black text-white">
      <ScrollArea>{children}</ScrollArea>
    </div>
  )
}

export default Layout
