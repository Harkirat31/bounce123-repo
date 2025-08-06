import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"

import DatePicker from "react-datepicker"
import { ordersSearchDate } from "../../store/atoms/orderAtom"
import PathArea from "../Path/PathArea"
import DriverDropDownForOrder from "../Order/DriverDropDownForOrder"
import { changePriority, } from "../../services/ApiService"
import { getOrder, getOrderIds, sortOrders } from "../../store/selectors/orderSelector"
import { OrderType } from "types"
import {  useState } from "react"
import { useNavigate } from "react-router-dom";
import { BiSortAlt2 } from "react-icons/bi";
import { refreshData } from "../../store/atoms/refreshAtom"
import { distinctOrdersDateAtom } from "../../store/atoms/distinctOrdersDateAtom"


const RouteCalculatorArea = () => {
    const [date, setDate] = useRecoilState(ordersSearchDate)
    const dates = useRecoilValue(distinctOrdersDateAtom)
    const ordersIds = useRecoilValue(getOrderIds)
    const navigate = useNavigate()
    const setSortOrders = useSetRecoilState(sortOrders(""))
    const OnDateChangeHandler = (date1: Date) => {
        setDate(date1) //setting date will triger useEffect in Init component
    }
    const refreshAllData = useSetRecoilState(refreshData)

    const refresh = () => {
        refreshAllData(Date.now().toString())
    }
    const sortHandle = () => {
        setSortOrders("")
    }


    return (

        <div className="grid grid-rows-2 h-full">

            <div className="overflow-y-scroll flex flex-col justify-start items-center">
                <div className="flex text-center justify-center items-center m-2">
                    <p className="text-center text-blue-900 mr-2">Date</p>
                    <DatePicker highlightDates={[...dates]} className="block text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500" showIcon selected={date} onChange={(date1: Date) => OnDateChangeHandler(date1)} />
                    <button onClick={refresh} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-2 text-center ml-2">Refresh All</button>
                </div>
                {ordersIds.length === 0 && <div className="flex flex-col justify-center h-full text-center items-center">
                    <p>No order is created for this day!!</p>
                    <a className="underline text-blue-900" onClick={() => navigate('/orders')} >Create new orders</a>
                </div>}
                {ordersIds.length > 0 &&
                    <table className="w-full text-xs text-center text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                {/* <th scope="col" className="px-1 py-3">
                                    Sr. No
                                </th> */}
                                <th scope="col" className="px-1 py-3">
                                    Ord. Id
                                </th>
                                <th scope="col" className="px-1 py-3">
                                    <div className="flex items-center justify-center">
                                        Status
                                        <button type="button" onClick={sortHandle} className="text-lg">
                                            <BiSortAlt2 />
                                        </button>
                                    </div>
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
                }

            </div>
            <div className="h-full overflow-y-scroll">
                <PathArea ></PathArea>
            </div>

        </div>
    )
}

export default RouteCalculatorArea


const OrderRow = (props: { orderId: string, index: number }) => {
    const [order, setOrder] = useRecoilState(getOrder(props.orderId))
    return (
        <tr className="border-b-2 border-gray-100 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
            {/* <td className="px-1 py-4">
                <p>{props.index}</p>
            </td> */}
            <td className="px-1 py-4">
                <p>{order!.orderNumber == "" ? "NA" : order!.orderNumber}</p>
            </td>
            <td className="px-1 py-4">
                {order!.currentStatus}
            </td>
            <td className="px-1 py-4">
                <DropdownForPriority order={order!} setOrder={setOrder}></DropdownForPriority>
            </td>
            {order!.currentStatus === "NotAssigned" || order!.currentStatus === "Assigned" ?
                <td className="px-1 py-4">
                    <DriverDropDownForOrder order={order!} setOrder={setOrder}></DriverDropDownForOrder>
                </td> :
                <td className="px-1 py-4">
                    {order!.driverName}
                </td>
            }
        </tr>
    )
}


const DropdownForPriority = ({ order, setOrder }: { order: OrderType, setOrder: any }) => {
    const [priority, setPriority] = useState(order.priority)
    return <>
        <select value={priority} onChange={(event) => {
            if (event.target.value === "Special" || event.target.value === "Low" || event.target.value === "High" || event.target.value === "Medium") {
                setPriority(event.target.value)
                changePriority(order.orderId!, event.target.value).then(
                    (result: any) => {
                        if (result.isAdded) {
                            setOrder({ ...order, priority: event.target.value })
                        }
                    }
                ).catch((_) => { })
            }
        }}>
            <option value={"Special"}>Special</option>
            <option value={"Low"}>Low</option>
            <option value={"Medium"}>Medium</option>
            <option value={"High"}>High</option>
        </select>
    </>
}