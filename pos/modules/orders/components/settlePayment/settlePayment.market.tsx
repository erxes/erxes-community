import usePrintBill from "@/modules/checkout/hooks/usePrintBill"
import useReciept from "@/lib/useReciept"
import { activeOrderAtom, setInitialAtom } from "@/store/order.store"
import { ebarimtSheetAtom } from "@/store/ui.store"
import { useAtom } from "jotai"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"

const MakePayment = () => {
  const [activeOrder] = useAtom(activeOrderAtom)
  const [, setInitial] = useAtom(setInitialAtom)
  const { changeVisiblity, loading, disabled, printBill } = usePrintBill()
  const [open] = useAtom(ebarimtSheetAtom)

  const { iframeRef } = useReciept({
    onCompleted() {
      changeVisiblity(false)
      setInitial()
    },
  })

  return (
    <>
      <Button
        className="w-full bg-green-500 hover:bg-green-500/90"
        size="lg"
        disabled={disabled}
        onClick={printBill}
        loading={loading}
      >
        Баримт хэвлэх
      </Button>
      <Sheet open={open} onOpenChange={() => changeVisiblity(false)}>
        <SheetContent closable className="flex flex-col p-4 sm:max-w-xs">
          <iframe
            ref={iframeRef}
            src={"/reciept/ebarimt/" + activeOrder + "?type=lol"}
            className="w-100 block flex-auto overflow-y-auto"
          />
        </SheetContent>
      </Sheet>
    </>
  )
}

export default MakePayment
