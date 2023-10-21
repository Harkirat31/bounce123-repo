import { useRecoilValue } from "recoil"
import { OrderType } from "types"
import { getOrders } from "../store/selectors/orderSelector"

const RouteCalculatorArea = () => {
    const orders = useRecoilValue(getOrders)
    return (
        <div className="grid grid-rows-2 h-full">
            <div className="overflow-y-scroll">
                <table className="text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-3 py-3 w-5">
                                Sr. No
                            </th>

                            <th scope="col" className="px-2 py-3 w-10">
                                Asign To
                            </th>
                            <th scope="col" className="px-1 py-3 w-full">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: OrderType) => {
                            return <>
                                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-3 py-4">
                                        <p>1</p>
                                    </td>
                                    <td className="px-1 py-4">
                                        <p>{order.driverName}</p>
                                    </td>
                                    <td className="px-1 py-4">
                                        {order.currentStatus}
                                    </td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </table>
            </div>
            <div className="">Paths</div>

        </div>
    )
}

export default RouteCalculatorArea
