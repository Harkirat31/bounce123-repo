import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"

import DatePicker from "react-datepicker"
import { ordersAtom, ordersSearchDate } from "../store/atoms/orderAtom"
import PathArea from "./PathArea"
import DriverDropDownForOrder from "./DriverDropDownForOrder"
import { getOrdersAPI } from "../services/ApiService"
import { getOrder, getOrderIds } from "../store/selectors/orderSelector"

const RouteCalculatorArea = () => {
    const setOrders = useSetRecoilState(ordersAtom)
    const [date, setDate] = useRecoilState(ordersSearchDate)
    const ordersIds = useRecoilValue(getOrderIds)
    const OnDateChangeHandler = (date1: Date) => {
        getOrdersAPI(date1).then((result: any) => {
            setDate(date1)
            setOrders(result)
        }).catch((error) => {
            alert("Unable to fetch the orders of this date")
        })
    }
    return (

        <div className="grid grid-rows-2 h-full">

            <div className="overflow-y-scroll flex flex-col justify-start items-center">
                <div className="flex justify-center m-2">
                    <p className="text-blue-900 mt-2">Date</p>
                    <DatePicker className="block text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500" showIcon selected={date} onChange={(date1: Date) => OnDateChangeHandler(date1)} />
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
                        {ordersIds.map((orderId, index) => {
                            return <OrderRow key={orderId} orderId={orderId!} index={index + 1}></OrderRow>
                        })}
                    </tbody>
                </table>
            </div>
            <div className="h-full overflow-y-scroll">
                <PathArea></PathArea>
            </div>

        </div>
    )
}

export default RouteCalculatorArea


const OrderRow = (props: { orderId: string, index: number }) => {
    const [order, setOrder] = useRecoilState(getOrder(props.orderId))
    return (
        <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="px-3 py-4">
                <p>{props.index}</p>
            </td>
            <td className="px-1 py-4">
                {order!.currentStatus}
            </td>
            <td className="px-1 py-4">
                {order!.priority}
            </td>
            <td className="px-1 py-4">
                <DriverDropDownForOrder order={order!} setOrder={setOrder}></DriverDropDownForOrder>
            </td>
        </tr>
    )
}

