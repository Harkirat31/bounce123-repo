import CreateOrder from "../components/CreateOrder.tsx";
import OrdersTable from "../components/OrdersTable.tsx";
import DatePicker from "react-datepicker"
import { ordersAtom, ordersSearchDate } from "../store/atoms/orderAtom.ts";
import { useRecoilState, useSetRecoilState } from "recoil";
import { getOrdersAPI } from "../services/ApiService.ts";


const Order = () => {
  const [date, setDate] = useRecoilState(ordersSearchDate)
  const setOrders = useSetRecoilState(ordersAtom)

  const OnDateChangeHandler = (date: Date) => {

    getOrdersAPI(date).then((result: any) => {
      setDate(new Date(date.setHours(0, 0, 0, 0)))
      setOrders(result)
    }).catch((_error) => {
      alert("Unable to fetch the orders of this date")
    })
  }


  return (
    <>
      <div className="mt-4 pt-4 xl:grid md:grid-cols-12">
        <div className="ml-2 md:col-span-9">
          <div className="flex items-center flex-col">
            <div className="flex">
              <p className="text-blue-900">Orders at a glance</p>
              <DatePicker className="block text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500" showIcon selected={date} onChange={(date: Date) => OnDateChangeHandler(date)} />
            </div>
            <OrdersTable></OrdersTable>
          </div>
        </div>
        <div className="ml-2 md:col-span-3 ">
          <CreateOrder></CreateOrder>
        </div>
      </div>
    </>
  )
}

export default Order


