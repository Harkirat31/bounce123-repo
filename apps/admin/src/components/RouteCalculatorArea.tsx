import { useRecoilValue } from "recoil"
import { DriverType, OrderType, order } from "types"
import { getOrders } from "../store/selectors/orderSelector"
import { useRef, useState } from "react"
import { getDrivers } from "../store/selectors/driversSelector"
import { BASE_URL } from "../../config"

const RouteCalculatorArea = () => {
    const orders = useRecoilValue(getOrders)
    return (
        <div className="grid grid-rows-2 h-full">
            <div className="overflow-y-scroll">
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
                        {orders.map((order: OrderType) => {
                            return <>
                                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-3 py-4">
                                        <p>1</p>
                                    </td>
                                    <td className="px-1 py-4">
                                        {order.currentStatus}
                                    </td>
                                    <td className="px-1 py-4">
                                        <DriverDropDownForOrder order={order}></DriverDropDownForOrder>
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



const DriverDropDownForOrder = (props: { order: OrderType }) => {
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const drivers: any = useRecoilValue(getDrivers)
    const [dropDownItem, setDropDownItem] = useState<{ driverId: string, driverName: string } | "Select">({ driverId: props.order.driverId ? props.order.driverId : "Select", driverName: props.order.driverName ? props.order.driverName : "Select" })

    const handleDropdownChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDropDownItem({ driverId: event.target.value, driverName: selectRef.current!.options[selectRef.current!.selectedIndex].text })
        const urlGetOrders = `${BASE_URL}/admin/assignOrder`
        if (dropDownItem == "Select") {
            return
        }
        let params = { orderId: props.order.orderId, driverId: event.target.value, driverName: selectRef.current!.options[selectRef.current!.selectedIndex].text }
        console.log(params)
        fetch(urlGetOrders, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        }).then(result => {
            result.json().then(
                (jsonData) => {
                    console.log(jsonData)
                }
            ).catch((error) => {
                console.log(error)
            })
        }).catch((error) => console.log("error"))

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
