"use client"

import { useState } from "react"
import Link from "next/link"
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

export const Sidebar = ({ isSlim }: { isSlim: boolean }) => {
  const [activeClass, setActiveClass] = useState("feed")

  const NavigationItem = ({ href, active, Icon, value, color }: any) => {
    return (
      <li
        className={`${
          active === activeClass ? "bg-white shadow-md text-[#444]" : ""
        } mb-4 flex items-center p-3 hover:bg-white rounded-xl hover:shadow-md text-[#A0AEC0] hover:text-[#444] cursor-pointer hover:transition-all`}
      >
        <div
          className={`${
            active === activeClass ? "bg-[#6569DF]" : ""
          } mr-2 bg-white shadow-md p-2 rounded-lg`}
        >
          <Icon
            size={18}
            color={`${active === activeClass ? "#FFF" : color}`}
          />
        </div>
        <span>{value}</span>
      </li>
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
  { active: "feed", url: "/", value: "Feed", Icon: HomeIcon, color: "#6569DF" },
  {
    active: "chats",
    url: "/chats",
    value: "Chats",
    Icon: MessageCircleIcon,
    color: "#A0AEC0",
    desc: "Coming soon",
  },
  {
    active: "team",
    url: "#",
    value: "Team members",
    Icon: Users2Icon,
    color: "#3B85F4",
    desc: "Coming soon",
  },
  {
    active: "discover",
    url: "#",
    value: "Discover",
    Icon: StarIcon,
    color: "#EA475D",
    desc: "Coming soon",
  },
  {
    active: "learn",
    url: "/learn",
    value: "Learn",
    Icon: ScrollTextIcon,
    color: "#3CCC38",
    desc: "Coming soon",
  },
  {
    active: "leaderboard",
    url: "#",
    value: "Leaderboard",
    Icon: AwardIcon,
    color: "#FF6600",
    desc: "Coming soon",
  },
  {
    active: "structure",
    url: "#",
    value: "Structure",
    Icon: LayersIcon,
    color: "#63D2D6",
    desc: "Coming soon",
  },
]
