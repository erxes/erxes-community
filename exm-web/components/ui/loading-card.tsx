import { Card, CardContent, CardHeader } from "./card"

const LoadingCard = () => {
  return (
    <div className="w-full">
      <Card className="max-w-2xl mx-auto my-4 border-0">
        <CardHeader>
          <div className="rounded-full bg-slate-100  w-10 h-10 mr-4" />
        </CardHeader>
        <CardContent className="px-2 pb-2 items-center ">
          <div className="w-full h-full flex flex-col justify-between">
            <div className="rounded-full bg-slate-100 w-full h-6 mb-2" />
            <div className="rounded-full bg-slate-100 w-4/5 h-4" />
          </div>
        </CardContent>
      </Card>
      <Card className="max-w-2xl mx-auto my-4 border-0">
        <CardHeader>
          <div className="rounded-full bg-slate-100  w-10 h-10 mr-4" />
        </CardHeader>
        <CardContent className="px-2 pb-2 items-center ">
          <div className="w-full h-full flex flex-col justify-between">
            <div className="rounded-full bg-slate-100 w-full h-6 mb-2" />
            <div className="rounded-full bg-slate-100 w-4/5 h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoadingCard
