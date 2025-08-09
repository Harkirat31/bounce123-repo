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
import { MdOutlineInventory, MdRoute } from "react-icons/md";


const RouteCalculatorArea = () => {
    const [date, setDate] = useRecoilState(ordersSearchDate)
    const dates = useRecoilValue(distinctOrdersDateAtom)
    const ordersIds = useRecoilValue(getOrderIds)
    const navigate = useNavigate()
    const setSortOrders = useSetRecoilState(sortOrders(""))
    const [activeTab, setActiveTab] = useState<'paths' | 'orders'>('paths')
    
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
        <div className="flex flex-col h-full bg-white">
            {/* Header with Date, Refresh and Tabs */}
            <div className="border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <p className="text-sm font-medium text-gray-700">Date</p>
                        <DatePicker 
                            highlightDates={[...dates]} 
                            className="block text-sm text-gray-900 border border-gray-300 rounded-lg bg-white px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                            showIcon 
                            selected={date} 
                            onChange={(date1: Date) => OnDateChangeHandler(date1)} 
                        />
                    </div>
                    <button 
                        onClick={refresh} 
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        Refresh All
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1 shadow-sm">
                    <button 
                        onClick={() => setActiveTab('paths')} 
                        type="button" 
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                            activeTab === 'paths' 
                                ? "text-white bg-green-600 shadow-md transform scale-105" 
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200 hover:shadow-sm"
                        }`}
                    >
                        <MdRoute className="w-4 h-4" />
                        <span>Paths</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')} 
                        type="button" 
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                            activeTab === 'orders' 
                                ? "text-white bg-blue-600 shadow-md transform scale-105" 
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200 hover:shadow-sm"
                        }`}
                    >
                        <MdOutlineInventory className="w-4 h-4" />
                        <span>Orders ({ordersIds.length})</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'paths' && (
                    <div className="h-full">
                        <PathArea />
                    </div>
                )}
                
                {activeTab === 'orders' && (
                    <div className="p-4">
                        {ordersIds.length === 0 ? (
                            <div className="flex flex-col justify-center items-center py-8 px-6 max-w-sm mx-auto">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                    <MdOutlineInventory className="w-8 h-8 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Orders Found</h3>
                                <p className="text-gray-600 text-center mb-4 text-sm">There are no orders created for this day. Create some orders to get started with path planning.</p>
                                <button 
                                    onClick={() => navigate('/orders')}
                                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                >
                                    Create New Orders
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm w-full max-w-full overflow-hidden">
                                <div className="overflow-x-hidden rounded-lg w-full max-w-full px-2">
                                    <table className="w-full max-w-full table-fixed text-[11px] leading-tight text-left text-gray-700 border-collapse">
                                        <thead className="text-[10px] text-gray-700 uppercase bg-gray-50 sticky top-0">
                                            <tr>
                                                <th scope="col" className="w-[56px] px-0 py-1 font-semibold">Ord. Id</th>
                                                <th scope="col" className="px-0 py-1 font-semibold">
                                                    <div className="flex items-center">
                                                        <span className="mr-0">Status</span>
                                                        <button type="button" onClick={sortHandle} className="text-gray-400 hover:text-gray-600">
                                                            <BiSortAlt2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </th>
                                                <th scope="col" className="px-0 py-1 font-semibold">Priority</th>
                                                <th scope="col" className="w-[90px] px-0 py-1 font-semibold">Assign To</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {ordersIds.map((orderId, index) => {
                                                return <OrderRow key={orderId} orderId={orderId!} index={index + 1}></OrderRow>
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default RouteCalculatorArea


const OrderRow = (props: { orderId: string, index: number }) => {
    const [order, setOrder] = useRecoilState(getOrder(props.orderId))
    return (
        <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors">
            <td className="w-[56px] px-0 py-1.5 font-medium text-gray-900 min-w-0">
                <div className="truncate max-w-[48px] whitespace-nowrap overflow-hidden">{order!.orderNumber == "" ? "NA" : order!.orderNumber}</div>
            </td>
            <td className="px-0 py-1.5 min-w-0">
                <span className={`inline-flex px-1 py-0.5 text-[9px] font-medium rounded-full ${
                    order!.currentStatus === "Delivered" ? "bg-green-100 text-green-800" :
                    order!.currentStatus === "OnTheWay" ? "bg-blue-100 text-blue-800" :
                    order!.currentStatus === "Picked" ? "bg-purple-100 text-purple-800" :
                    order!.currentStatus === "Assigned" ? "bg-yellow-100 text-yellow-800" :
                    order!.currentStatus === "SentToDriver" ? "bg-orange-100 text-orange-800" :
                    order!.currentStatus === "PathAssigned" ? "bg-indigo-100 text-indigo-800" :
                    order!.currentStatus === "Returned" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                }`}>
                    {order!.currentStatus}
                </span>
            </td>
            <td className="px-0 py-1.5 min-w-0">
                <div className="w-[80px] min-w-0">
                    <DropdownForPriority order={order!} setOrder={setOrder}></DropdownForPriority>
                </div>
            </td>
            {order!.currentStatus === "NotAssigned" || order!.currentStatus === "Assigned" ?
                <td className="px-0 py-1.5 min-w-0">
                    <div className="w-[90px] min-w-0">
                        <DriverDropDownForOrder order={order!} setOrder={setOrder}></DriverDropDownForOrder>
                    </div>
                </td> :
                <td className="px-0 py-1.5 text-gray-900 min-w-0">
                    <div className="truncate whitespace-nowrap overflow-hidden max-w-[90px]">{order!.driverName}</div>
                </td>
            }
        </tr>
    )
}


const DropdownForPriority = ({ order, setOrder }: { order: OrderType, setOrder: any }) => {
    const [priority, setPriority] = useState(order.priority)
    
    const getPriorityColor = (priority: string) => {
        switch(priority) {
            case "Special": return "bg-purple-100 text-purple-800";
            case "High": return "bg-red-100 text-red-800";
            case "Medium": return "bg-yellow-100 text-yellow-800";
            case "Low": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    }
    
    return (
        <select 
            value={priority} 
            onChange={(event) => {
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
            }}
            className={`text-xs font-medium rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${getPriorityColor(priority)}`}
        >
            <option value={"Special"}>Special</option>
            <option value={"Low"}>Low</option>
            <option value={"Medium"}>Medium</option>
            <option value={"High"}>High</option>
        </select>
    )
}