import { useRecoilState, useRecoilValue } from "recoil"
import { getOrder, getOrderIds } from "../../store/selectors/orderSelector"
import { ordersSearchDate, rowsToBeDeleted } from "../../store/atoms/orderAtom"
import { OrderType } from "types"
import { deleteOrders } from "../../services/ApiService"

const OrdersTable = () => {

    // let items: number[] = [1, 2, 3];
    const orders = useRecoilValue(getOrderIds)

    if (orders != null && orders.length > 0) {
        return <>
            <div className="mt-4 w-full shadow-md sm:rounded-lg overflow-scroll">
                <table className="text-sm text-left w-full text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-3 py-3 w-10">
                                Ord. Id
                            </th>
                            <th scope="col" className="px-3 py-3 w-10">
                                Name
                            </th>
                            <th scope="col" className="px-1 py-3 w-10">
                                Address
                            </th>
                            <th scope="col" className="px-1 py-3 w-10">
                                Phone
                            </th>
                            <th scope="col" className="px-1 py-3 w-12">
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
                            <th scope="col" className="px-1 py-3 w-10">
                                Payment Status
                            </th>
                            <th scope="col" className="px-2 py-3 w-10">
                                Asign To
                            </th>
                            <th scope="col" className="px-1 py-3 w-10">
                                Status
                            </th>

                            <th scope="col" className="px-1 py-3 w-10">
                                <DeleteRows></DeleteRows>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((orderId: any) => {
                            return <OrderRow orderId={orderId}></OrderRow>
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


const OrderRow = ({ orderId }: any) => {
    const order = useRecoilValue(getOrder(orderId))
    let date = new Date()
    if (order) {
        date = new Date(order.deliveryDate)
        //date.setDate(date.getUTCDate())

    }
    return <>
        {order &&
            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-3 py-4">
                    <p>{order.orderNumber}</p>
                </td>
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
                    {date.toUTCString().slice(0, 16)}
                </td>
                <td className="px-1 py-4">
                    {order.priority}
                </td>
                <td className="px-1 py-4">
                    {order.itemsDetail}
                </td>
                <td className="px-1 py-4">
                    {order.specialInstructions}
                </td>
                <td className="px-1 py-4">
                    {order.paymentStatus??"N/A"}
                </td>
                <td className="px-1 py-4">
                    {order.driverName}
                </td>
                <td className="px-1 py-4">
                    {order.currentStatus}
                </td>
                <td className="px-1 py-4">
                    <ColumnDeleteCheckBox order={order} ></ColumnDeleteCheckBox>
                </td>
            </tr>
        }
    </>
}

const ColumnDeleteCheckBox = (props: { order: OrderType }) => {
    const [rows, setRows] = useRecoilState(rowsToBeDeleted)
    return <>
        {props.order.currentStatus == "NotAssigned" ? <input
        checked={rows.has(props.order.orderId)}
            onChange={(event) => {
                if (event.target.checked) {
                    let setCopy = new Set(rows)
                    setCopy.add(props.order.orderId)
                    setRows(setCopy)
                }
                else {
                    let setCopy = new Set(rows)
                    setCopy.delete(props.order.orderId)
                    setRows(setCopy)
                }
            }
            } type="checkbox" className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2">
        </input> : "NA"}</>
}


const DeleteRows = () => {
    const [rows, setRows] = useRecoilState(rowsToBeDeleted)
    const [searchDate, setSearchDate] = useRecoilState(ordersSearchDate)
    const onDeleteHandle = () => {
        console.log(rows)
        deleteOrders([...rows]).then(() => {
            setSearchDate(new Date(searchDate))
            setRows(new Set())
        })
        
    }
    return <>
        <button onClick={onDeleteHandle} type="button" className="text-xs text-blue-700 underline" >Delete Selected </button>
    </>
}


export default OrdersTable