"use client"

import Link from "next/link"
import {
  AwardIcon,
  HomeIcon,
  LayersIcon,
  ScrollTextIcon,
  StarIcon,
  User2Icon,
} from "lucide-react"

import Image from "@/components/ui/image"

export const Sidebar = () => {
  return (
    <div className="h-full p-8">
      <div className="mb-4 w-full border-b border-[#EEE] p-3">
        <Image alt="" src="/erxes-dark.svg" height={50} width={100} />
      </div>

      <div className="w-full h-full">
        <ul className="list-none">
          {MAIN_NAVIGATION.map((item) => (
            <NavigationItem {...item} key={item.key} />
          ))}
        </ul>
      </div>
    </div>
  )
}

const NavigationItem = ({ href, Icon, value, color }: any) => (
  <li className="mb-4 flex items-center p-3 hover:bg-white rounded-xl hover:shadow-md text-[#A0AEC0] hover:text-[#444] cursor-pointer hover:transition-all">
    <div className="mr-2 bg-white shadow-md p-2 rounded-lg">
      <Icon size={18} color={color} />
    </div>
    <span>{value}</span>
  </li>
)

export const MAIN_NAVIGATION = [
  { key: "feed", url: "/", value: "Feed", Icon: HomeIcon, color: "#6569DF" },
  {
    key: "team",
    url: "#",
    value: "Team members",
    Icon: User2Icon,
    color: "#3B85F4",
    desc: "Coming soon",
  },
  {
    key: "discover",
    url: "#",
    value: "Discover",
    Icon: StarIcon,
    color: "#EA475D",
    desc: "Coming soon",
  },
  {
    key: "learn",
    url: "/learn",
    value: "Learn",
    Icon: ScrollTextIcon,
    color: "#3CCC38",
    desc: "Coming soon",
  },
  {
    key: "leaderboard",
    url: "#",
    value: "Leaderboard",
    Icon: AwardIcon,
    color: "#FF6600",
    desc: "Coming soon",
  },
  {
    key: "structure",
    url: "#",
    value: "Structure",
    Icon: LayersIcon,
    color: "#63D2D6",
    desc: "Coming soon",
  },
]
