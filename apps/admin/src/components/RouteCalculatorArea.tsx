import { useRecoilState, useRecoilValue } from "recoil"
import { DriverType, OrderType } from "types"
import { useRef, useState } from "react"
import { getDrivers } from "../store/selectors/driversSelector"
import { BASE_URL } from "../../config"
import DatePicker from "react-datepicker"
import { getOrderById, ordersAtom, ordersSearchDate } from "../store/atoms/orderAtom"

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
            <div className="overflow-y-scroll">
                <div className="flex justify-center m-2">
                    <p className="text-blue-900">Date</p>
                    <DatePicker className="block text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500" showIcon selected={date} onChange={(date: Date) => OnDateChangeHandler(date)} />
                </div>
                <table className="text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-3 py-3">
                                Sr. No
                            </th>
                            <th scope="col" className="px-1 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-2 py-3 w-full">
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
            <div className="">Paths</div>

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
                <DriverDropDownForOrder order={props.order}></DriverDropDownForOrder>
            </td>
        </tr>
    )
}


const DriverDropDownForOrder = (props: { order: OrderType }) => {
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const drivers: any = useRecoilValue(getDrivers)
    const [dropDownItem, setDropDownItem] = useState<{ driverId: string, driverName: string } | "Select">({ driverId: props.order.driverId ? props.order.driverId : "Select", driverName: props.order.driverName ? props.order.driverName : "Select" })
    const [order, setOrder] = useRecoilState(getOrderById(props.order.orderId!))
    const handleDropdownChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        if (event.target.value == "Select") {
            return
        }
        if (dropDownItem == "Select") {
            return
        }
        setDropDownItem({ driverId: event.target.value, driverName: selectRef.current!.options[selectRef.current!.selectedIndex].text })
        const urlAssignOrder = `${BASE_URL}/admin/assignOrder`

        let params = { orderId: order!.orderId, driverId: event.target.value, driverName: selectRef.current!.options[selectRef.current!.selectedIndex].text }
        fetch(urlAssignOrder, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        }).then((response) => response.json().then((jsonData) => {
            console.log(jsonData)
            if (jsonData.isAdded == true) {
                setOrder((order) => ({ ...order, ...params }) as OrderType)
            }
            else {
                console.log("Not updated Order")
            }
        }))

    }

    return <>
        <select ref={selectRef} value={dropDownItem == "Select" ? "Select" : dropDownItem.driverId} onChange={(event) => handleDropdownChanged(event)} className="ml-2  border-2 border-blue-900" >
            <option value={"Select"}>Select</option>
            {drivers.map((driver: DriverType) => {
                return <>
                    <option value={driver.uid}>{driver.name}</option>
                </>
            })}
        </select>
    </>
}
