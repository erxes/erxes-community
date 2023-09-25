import "@/styles/globals.css"
import CheckAuth from "@/modules/auth/checkAuth"
import Configs from "@/modules/auth/configs"

import { Sidebar } from "@/components/Sidebar"

interface ILayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: ILayoutProps) {
  return (
    <Configs>
      <CheckAuth>
        <div className="relative flex h-screen flex-col">
          <>
            <section className="flex flex-auto items-stretch bg-[#F8F9FA]">
              <div className="flex w-1/5 flex-col border-r">
                <Sidebar isSlim={false} />
              </div>
              <div className="flex h-full w-full flex-col">
                <div className="mt-1 flex flex-none items-center pb-3 pr-3">
                  {children}
                </div>
              </div>
              <div className="flex w-1/3 flex-col border-l">
                <p>31</p>
              </div>
            </section>
          </>
        </div>
      </CheckAuth>
    </Configs>
  )
}
