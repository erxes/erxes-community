import dynamic from "next/dynamic"



const Market = dynamic(() => import("@/app/(main)/market"))

const Home = () => {
  return (
    <>
      <Market />
    </>
  )
}

export default Home
