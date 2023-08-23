import Image from "@/components/ui/image"
import LoginContainer from '@/modules/auth/login'

const Login = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-neutral-100 p-10">
      <div className="flex h-full w-full items-center justify-center rounded-3xl bg-white shadow-xl">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-5 flex w-full justify-center rounded-lg border py-3">
            <Image
              alt="name"
              src={"/logo-dark.png" || ""}
              fallBack={"/logo-dark.png"}
              height={48}
              width={96}
              noWrap
            />
          </div>
          <h5 className='pb-3 text-lg font-extrabold text-primary'>Welcome to Butenorgil!</h5>
          <LoginContainer />
        </div>
      </div>
    </div>
  )
}

export default Login
