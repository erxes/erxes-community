"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Chat from "@/modules/chat/component/Chat"
import {
  AwardIcon,
  HomeIcon,
  LayersIcon,
  MessageCircleIcon,
  ScrollTextIcon,
  StarIcon,
  Users2Icon,
} from "lucide-react"

import Image from "@/components/ui/image"

export const Sidebar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [activeClass, setActiveClass] = useState(pathname)

  const handleLink = (href: string) => {
    router.push(`/${href}`)
    setActiveClass(`/${href}`)
  }

  const NavigationItem = ({ href, active, Icon, value, color }: any) => {
    if (pathname === "/chats") {
      return (
        <li
          className={`mb-4 flex p-3 cursor-pointer`}
          onClick={() => handleLink(href)}
        >
          <div
            className={`${
              active === activeClass ? "bg-black" : "bg-white"
            } mr-2 shadow-md p-2 rounded-lg`}
          >
            <Icon
              size={18}
              color={`${active === activeClass ? "#FFF" : "black"}`}
            />
          </div>
        </li>
      )
    }

    return (
      <li
        className={`${
          activeClass === active ? "shadow-md text-black" : ""
        } mb-4 flex items-center p-3 hover:bg-white rounded-xl hover:shadow-md text-black hover:text-black cursor-pointer hover:transition-all`}
        onClick={() => handleLink(href)}
      >
        <div
          className={`${
            activeClass === active ? "bg-black" : "bg-white"
          } mr-2 shadow-md p-2 rounded-lg`}
        >
          <Icon
            size={18}
            color={`${activeClass === active ? "#FFF" : "black"}`}
          />
        </div>
        <span>{value}</span>
      </li>
    )
  }

  if (pathname === "/chats") {
    return (
      <div className="flex w-1/4 border-r">
        <div className="h-full p-4 border-r w-1/5">
          <div className="mb-4 w-full border-b border-[#EEE] p-3">
            <Image alt="" src="/logo.svg" height={50} width={100} />
          </div>

          <div className="w-full h-full">
            <ul className="list-none">
              {MAIN_NAVIGATION.map((item, i) => (
                <NavigationItem {...item} key={i} />
              ))}
            </ul>
          </div>
        </div>

        <Chat />
      </div>
    )
  }

  return (
    <div className="flex w-1/5 flex-col border-r">
      <div className="h-full p-8">
        <div className="mb-4 w-full border-b border-[#EEE] p-3">
          <Image alt="" src="/erxes-dark.svg" height={50} width={100} />
        </div>

        <div className="w-full h-full">
          <ul className="list-none">
            {MAIN_NAVIGATION.map((item, i) => (
              <NavigationItem {...item} key={i} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export const MAIN_NAVIGATION = [
  {
    active: "/",
    href: "",
    value: "Feed",
    Icon: HomeIcon,
    color: "#6569DF",
  },
  {
    active: "/chats",
    href: "chats",
    value: "Chats",
    Icon: MessageCircleIcon,
    color: "#A0AEC0",
    desc: "Coming soon",
  },
  {
    active: "/team",
    href: "#",
    value: "Team members",
    Icon: Users2Icon,
    color: "#3B85F4",
    desc: "Coming soon",
  },
  {
    active: "/discover",
    href: "#",
    value: "Discover",
    Icon: StarIcon,
    color: "#EA475D",
    desc: "Coming soon",
  },
  {
    active: "/learn",
    href: "#",
    value: "Learn",
    Icon: ScrollTextIcon,
    color: "#3CCC38",
    desc: "Coming soon",
  },
  {
    active: "/leaderboard",
    href: "#",
    value: "Leaderboard",
    Icon: AwardIcon,
    color: "#FF6600",
    desc: "Coming soon",
  },
  {
    active: "/structure",
    href: "#",
    value: "Structure",
    Icon: LayersIcon,
    color: "#63D2D6",
    desc: "Coming soon",
  },
]
