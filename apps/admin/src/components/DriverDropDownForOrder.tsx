import { DriverType, OrderType } from "types";
import { BASE_URL } from "../../config";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { getDrivers } from "../store/selectors/driversSelector";



const DriverDropDownForOrder = (props: { order: OrderType, setOrder: any }) => {
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const drivers: any = useRecoilValue(getDrivers)
    const [dropDownItem, setDropDownItem] = useState<{ driverId: string, driverName: string } | "Select">("Select")
    const order = props.order
    useEffect(() => {
        setDropDownItem({ driverId: props.order.driverId ? props.order.driverId : "Select", driverName: props.order.driverName ? props.order.driverName : "Select" })
    }, [order])

    const handleDropdownChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        if (event.target.value == "Select") {
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
                props.setOrder((order: OrderType) => ({ ...order, ...params, currentStatus: "Assigned" }) as OrderType)
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
export default DriverDropDownForOrder