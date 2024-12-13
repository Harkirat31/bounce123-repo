import CreateOrder from "../components/Order/CreateOrder.tsx";
import OrdersTable from "../components/Order/OrdersTable.tsx";
import DatePicker from "react-datepicker"
import { ordersSearchDate } from "../store/atoms/orderAtom.ts";
import { useRecoilState } from "recoil";



const Order = () => {
  const [date, setDate] = useRecoilState(ordersSearchDate)

  const OnDateChangeHandler = (date: Date) => {
    setDate(date)
  }


  return (
    <>
      <div className="mt-4 pt-4 xl:grid xl:grid-cols-12">
        <div className="ml-2 xl:col-span-9 overflow-scroll">
          <div className="flex items-center flex-col">
            <div className="flex">
              <p className="text-blue-900 font-bold mr-2">Orders at a glance</p>
              <DatePicker className="block text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500" showIcon selected={date} onChange={(date: Date) => OnDateChangeHandler(date)} />
            </div>
            <OrdersTable></OrdersTable>
          </div>
        </div>
        <div className="mt-10 xl:mt-0 ml-4 xl:col-span-3">
          <CreateOrder></CreateOrder>
        </div>
      </div>
    </>
  )
}

export default Order


