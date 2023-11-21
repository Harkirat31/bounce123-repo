import { useRecoilValue } from "recoil"
import { OrderType } from "types"
import { getOrders } from "../store/selectors/orderSelector"

const OrdersTable = () => {

    // let items: number[] = [1, 2, 3];
    const orders = useRecoilValue(getOrders)

    if (orders != null && orders.length > 0) {
        return <>
            <div className="mt-4 shadow-md sm:rounded-lg">
                <table className="text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-3 py-3 w-10">
                                Name
                            </th>
                            <th scope="col" className="px-1 py-3 w-10">
                                Address
                            </th>
                            <th scope="col" className="px-1 py-3 w-10">
                                Phone
                            </th>
                            <th scope="col" className="px-1 py-3 w-10">
                                Date
                            </th>
                            <th scope="col" className="px-1 py-3 w-10" >
                                Priority
                            </th>
                            <th scope="col" className="px-1 py-3 w-10" >
                                Items Detail
                            </th>

                            {/* <th scope="col" className="px-1 py-3 w-10">
                                Main Items
                            </th>
                            <th scope="col" className="px-1 py-3 w-10">
                                Extras
                            </th> */}
                            <th scope="col" className="px-1 py-3 w-10">
                                Instructions
                            </th>
                            <th scope="col" className="px-2 py-3">
                                Asign To
                            </th>
                            <th scope="col" className="px-1 py-3 w-10">
                                Status
                            </th>

                            <th scope="col" className="px-1 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: OrderType) => {
                            return <>
                                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-3 py-4">
                                        <p>{order.cname}</p>
                                    </td>
                                    <td className="px-1 py-4">
                                        <p>{order.address}</p>
                                    </td>
                                    <td className="px-1 py-4">
                                        {order.cphone}
                                    </td>
                                    <td className="px-1 py-4">
                                        {new Date(order.deliveryDate).toDateString()}
                                    </td>
                                    <td className="px-1 py-4">
                                        {order.priority}
                                    </td>
                                    <td className="px-1 py-4">
                                        {order.itemsDetail}
                                    </td>

                                    {/* <td className="px-1 py-4">
                                        {order.itemsDetail.map((item) => {
                                            return <>{
                                                <p>{item.rentingItemTitle}</p>
                                            }</>
                                        })}
                                    </td> */}
                                    {/* <td className="px-1 py-4">
                                        {order.extraItems && order.extraItems.map((item) => {
                                            return <>{
                                                <p>{item.sideItemTitle}</p>
                                            }</>
                                        })}
                                    </td> */}
                                    <td className="px-1 py-4">
                                        {order.specialInstructions}
                                    </td>
                                    <td className="px-1 py-4">
                                        {order.driverName}
                                    </td>
                                    <td className="px-1 py-4">
                                        {order.currentStatus}
                                    </td>
                                    <td className="px-3 py-4 text-right">
                                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</a>
                                    </td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </table>
            </div>

        </>

    }
    else {
        return <div className="mt-10 w-1/2 bg-slate-50 shadow-md">
            <p className="p-10">No Order</p>
        </div>
    }

}

export default OrdersTable