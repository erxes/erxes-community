import BuyAction from "@/modules/checkout/components/buyAction/buyAction.main"
import Cart from "@/modules/checkout/components/cart/cart.main"
import TotalAmount from "@/modules/checkout/components/totalAmount/totalAmount.main"
import OrderDetail from "@/modules/orders/OrderDetail.main"
import ChooseType from "@/modules/orders/components/chooseType/chooseType.main"
import Search from "@/modules/products/components/search/search.main"
import ProductCategories from "@/modules/products/productCategories.main"
import Products from "@/modules/products/products.main"

import Customer from "@/modules/customer"
import Header from "@/components/header/header.main"

const MainIndexPage = () => {
  return (
    <>
      <Header />
      <section className="flex flex-auto items-stretch overflow-hidden">
        <div className="flex h-full w-2/3 flex-col p-4 pr-0">
          <div className="-mt-1 flex flex-none items-center pb-3 pr-3">
            <Search />
            <div className="flex flex-auto overflow-hidden">
              <ProductCategories />
            </div>
          </div>
          <Products />
        </div>
        <div className="flex w-1/3 flex-col border-l">
          <OrderDetail>
            <>
              <div className="p-4">
                <Customer />
              </div>
              <Cart />
              <div className="grid flex-none grid-cols-2 gap-3 p-4">
                <TotalAmount />
                <ChooseType />
                <BuyAction />
              </div>
            </>
          </OrderDetail>
        </div>
      </section>
    </>
  )
}

export default MainIndexPage
