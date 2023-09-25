import dynamic from "next/dynamic"

const Feed = dynamic(() => import("@/modules/feed/component/Feed"))

export default function IndexPage() {
  return (
    <>
      <div className="flex h-full w-full flex-col">
        <div className="flex flex-none items-center mt-5">
          <Feed />
        </div>
      </div>
      <div className="flex w-1/3 flex-col border-l">
        <p>31</p>
      </div>
    </>
  )
}
