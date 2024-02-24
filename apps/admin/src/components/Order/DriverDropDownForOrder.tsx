import { DriverType, OrderType, PathOrderType } from "types";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getDrivers } from "../../store/selectors/driversSelector";
import { assignOrderAndPath, getPathsAPI } from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import { savedPathsAtom } from "../../store/atoms/pathAtom";
import { loadingState } from "../../store/atoms/loadingStateAtom";



const DriverDropDownForOrder = (props: { order: OrderType, setOrder: any }) => {
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const drivers: any = useRecoilValue(getDrivers)
    const [dropDownItem, setDropDownItem] = useState<{ driverId: string, driverName: string } | "Select">("Select")
    const order = props.order
    const setSavedPathsAtom = useSetRecoilState(savedPathsAtom)
    const navigate = useNavigate()
    const setLoading = useSetRecoilState(loadingState)
    useEffect(() => {
        setDropDownItem({ driverId: props.order.driverId ? props.order.driverId : "Select", driverName: props.order.driverName ? props.order.driverName : "Select" })
    }, [order])

    const handleDropdownChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();

        setDropDownItem({ driverId: event.target.value, driverName: selectRef.current!.options[selectRef.current!.selectedIndex].text })

        //let params = { orderId: order!.orderId, driverId: event.target.value, driverName: selectRef.current!.options[selectRef.current!.selectedIndex].text }

        // assignDriver(params.orderId!, params.driverId, params.driverName).then((response: any) => {
        //     if (response.isAdded == true) {
        //         props.setOrder(({ ...order, ...params, currentStatus: "Assigned" }) as OrderType)
        //     }
        //     else {
        //         console.log("Not updated Order")
        //     }
        // })

    }

    const hanldeSendSMS = () => {

        if (dropDownItem == "Select") {
            alert("Please Select Driver from dropdown")
            return
        }
        if (dropDownItem.driverId == "Select") {
            alert("Please Select Driver from dropdown")
            return
        }

        const confirm = window.confirm("Are you Sure?")
        if (!confirm) {
            return
        }

        setLoading(true)
        let params: PathOrderType = { dateOfPath: order.deliveryDate, show: true, path: [order!.orderId!], driverId: dropDownItem.driverId, driverName: dropDownItem.driverName }

        assignOrderAndPath(params).then((response: any) => {
            if (response.isAdded == true) {
                props.setOrder(({ ...order, assignedPathId: response.pathId, driverId: params.driverId, driverName: params.driverName, currentStatus: "SentToDriver" }) as OrderType)
                getPathsAPI(order.deliveryDate).then((data: any) => {
                    setSavedPathsAtom([...data]);
                });
            }
            else {
                console.log("Error, Order Not updated")
            }

            setLoading(false)
        }).catch((error) => {
            alert(error)
            setLoading(false)
        })
    }
    if (props.order.driverId) {
        return <div>
            <p>{props.order.driverName}</p>
        </div>
    }
    if (drivers.length == 0) {
        return <>
            <p>No Driver Created</p>
            <a className="underline text-blue-900" onClick={() => navigate('/drivers')} >Create New</a>
        </>
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
        <button onClick={hanldeSendSMS} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-1  text-center ml-1">
            Send
        </button>
    </>
}
export default DriverDropDownForOrder