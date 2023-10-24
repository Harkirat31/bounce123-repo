
import { useState } from "react";
import CreateOrder from "../components/CreateOrder.tsx";
import OrdersTable from "../components/OrdersTable.tsx";
import DatePicker from "react-datepicker"
import { ordersState } from "../store/atoms/orderAtom.ts";
import { BASE_URL } from "../../config.ts";
import { useSetRecoilState } from "recoil";


const Order = () => {
  const [date, setDate] = useState<Date | null>(new Date())
  const setOrders = useSetRecoilState(ordersState)

  const OnDateChangeHandler = (date: Date) => {
    console.log(new Date(date.setUTCHours(0, 0, 0, 0)))

    const urlGetOrders = `${BASE_URL}/admin/getOrders`

    fetch(urlGetOrders, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: date.setUTCHours(0, 0, 0, 0) })
    }).then(result => {
      result.json().then(
        (jsonData) => {
          console.log(jsonData)
          setDate(date)
          setOrders({
            isLoading: false,
            value: jsonData,
            date: date
          })
        }
      ).catch((error) => {
        console.log(error)
      })
    }).catch((error) => console.log("error"))
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


