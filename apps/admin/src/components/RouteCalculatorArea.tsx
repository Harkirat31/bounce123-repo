import { useRecoilState } from "recoil"
import { OrderType } from "types"

import { BASE_URL } from "../../config"
import DatePicker from "react-datepicker"
import { ordersAtom, ordersSearchDate } from "../store/atoms/orderAtom"
import PathArea from "./PathArea"
import DriverDropDownForOrder from "./DriverDropDownForOrder"

const RouteCalculatorArea = () => {
    const [orders, setOrders] = useRecoilState(ordersAtom)
    const [date, setDate] = useRecoilState(ordersSearchDate)
    const OnDateChangeHandler = (date: Date) => {

        const urlGetOrders = `${BASE_URL}/admin/getOrders`

        fetch(urlGetOrders, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: date.setHours(0, 0, 0, 0) })
        }).then(result => {
            result.json().then(
                (jsonData) => {
                    console.log(jsonData)
                    setDate(new Date(date.setHours(0, 0, 0, 0)))
                    setOrders(jsonData)
                }
            ).catch((error) => {
                console.log(error)
            })
        }).catch((error) => console.log("error"))
    }
    return (
        <div className="grid grid-rows-2 h-full">
            <div className="overflow-y-scroll flex flex-col justify-start items-center">
                <div className="flex justify-center m-2">
                    <p className="text-blue-900 mt-2">Date</p>
                    <DatePicker className="block text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500" showIcon selected={date} onChange={(date: Date) => OnDateChangeHandler(date)} />
                </div>
                <table className="w-full text-sm text-center text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-3 py-3">
                                Sr. No
                            </th>
                            <th scope="col" className="px-1 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-1 py-3">
                                Priority
                            </th>
                            <th scope="col" className="px-2 py-3">
                                Asign To
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: OrderType, index: number) => {
                            return <OrderRow key={order.orderId} order={order} index={index + 1}></OrderRow>
                        })}
                    </tbody>
                </table>
            </div>
            <div className="">
                <PathArea></PathArea>
            </div>

        </div>
    )
}

export default RouteCalculatorArea


const OrderRow = (props: { order: OrderType, index: number }) => {

    return (
        <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="px-3 py-4">
                <p>{props.index}</p>
            </td>
            <td className="px-1 py-4">
                {props.order.currentStatus}
            </td>
            <td className="px-1 py-4">
                {props.order.priority}
            </td>
            <td className="px-1 py-4">
                <DriverDropDownForOrder order={props.order}></DriverDropDownForOrder>
            </td>
        </tr>
    )
}

