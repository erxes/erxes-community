import { Feed } from "@/modules/feed/component/Feed"

export default function IndexPage() {
  return (
    <>
      <div className="flex h-full w-full flex-col">
        <div className="mt-1 flex flex-none items-center pb-3 pr-3">
          <Feed />
        </div>
      </div>
      <div className="flex w-1/3 flex-col border-l">
        <p>31</p>
      </div>
    </>
  )
}
