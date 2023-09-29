import Loader from "./loader"

const LoadingPost = () => {
  return (
    <div className="backdrop-blur-sm z-10 flex flex-col items-center justify-center absolute w-full h-full">
      <Loader className="flex-none w-10 h-10" />
      <h3 className="text-md font-semibold text-[#444]">Posting</h3>
    </div>
  )
}

export default LoadingPost
