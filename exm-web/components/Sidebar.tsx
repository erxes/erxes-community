"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
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
    return (
      <li
        className={`${
          activeClass === active ? "shadow-md text-black" : ""
        } mb-4 flex items-center p-3 hover:bg-white rounded-xl hover:shadow-md text-black hover:text-black cursor-pointer hover:transition-all`}
        onClick={() => handleLink(href)}
      >
        <div
          className={`${
            activeClass === active ? "bg-[#6569DF]" : "bg-white"
          } mr-2 shadow-md p-2 rounded-lg`}
        >
          <Icon
            size={18}
            color={`${activeClass === active ? "#FFF" : color}`}
          />
        </div>
        {pathname.includes("/chat") ? (
          ""
        ) : (
          <span
            className={`${
              activeClass === active ? "text-[#444]" : "text-[#A0AEC0]"
            }`}
          >
            {value}
          </span>
        )}
      </li>
    )
  }

  return (
    <div
      className={`h-full p-4 border-r  ${
        pathname.includes("/chat") ? "" : "w-1/5"
      }`}
    >
      <div className="w-full pb-2 mb-4 border-b flex justify-center">
        <Image
          alt=""
          src="/logo-dark.svg"
          height={100}
          width={100}
          className={`${pathname.includes("/chat") ? "w-10 h-10" : ""}`}
        />
      </div>

      <div className="w-full h-full">
        <ul className="list-none">
          {MAIN_NAVIGATION.map((item, i) => (
            <NavigationItem {...item} key={i} />
          ))}
        </ul>
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
