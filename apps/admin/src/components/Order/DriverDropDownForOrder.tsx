import { DriverType, OrderType, PathOrderType } from "types";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getDrivers } from "../../store/selectors/driversSelector";
import { assignOrderAndPath, getPathsAPI } from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import { savedPathsAtom } from "../../store/atoms/pathAtom";
import { loadingState } from "../../store/atoms/loadingStateAtom";
import { userAtom } from "../../store/atoms/userAtom";



const DriverDropDownForOrder = (props: { order: OrderType, setOrder: any }) => {
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const drivers: DriverType[] = useRecoilValue(getDrivers)
    const [dropDownItem, setDropDownItem] = useState<{ driverId: string, driverName: string } | "Select">("Select")
    const order = props.order
    const setSavedPathsAtom = useSetRecoilState(savedPathsAtom)
    const navigate = useNavigate()
    const setLoading = useSetRecoilState(loadingState)
    const user = useRecoilValue(userAtom)
    
    useEffect(() => {
        setDropDownItem({ driverId: props.order.driverId ? props.order.driverId : "Select", driverName: props.order.driverName ? props.order.driverName : "Select" })
    }, [order])

    const handleDropdownChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        setDropDownItem({ driverId: event.target.value, driverName: selectRef.current!.options[selectRef.current!.selectedIndex].text })
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

        setLoading({isLoading:true,value:"Please Wait..."})
        const startingLocation = user?.location??{lat:0,lng:0}
        let params: PathOrderType = { dateOfPath: order.deliveryDate, show: true, path: [{id:order!.orderId!,latlng:order!.location}], driverId: dropDownItem.driverId, driverName: dropDownItem.driverName ,startingLocation}

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

            setLoading({isLoading:false,value:null})
        }).catch((error) => {
            alert(error)
            setLoading({isLoading:false,value:null})
        })
    }

    if (props.order.driverId) {
        return (
            <div className="max-w-[220px] truncate text-gray-900">
                {props.order.driverName}
            </div>
        )
    }

    if (drivers.length == 0) {
        return (
            <div className="max-w-[220px] text-sm">
                <p className="text-gray-700">No Driver Created</p>
                <button className="underline text-blue-700 hover:text-blue-900" onClick={() => navigate('/drivers')}>Create New</button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-1 max-w-[90px] w-full">
            <div className="relative w-full">
                <select 
                    ref={selectRef} 
                    value={dropDownItem == "Select" ? "Select" : dropDownItem.driverId} 
                    onChange={(event) => handleDropdownChanged(event)} 
                    className="w-full appearance-none bg-white border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    title={dropDownItem == "Select" ? "Select" : dropDownItem.driverName}
                >
                    <option value={"Select"}>Select</option>
                    {drivers.map((driver: DriverType) => (
                        <option key={driver.uid} value={driver.uid} title={driver.name}>{driver.name}</option>
                    ))}
                </select>
                {/* simple chevron */}
                <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.173l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
            </div>
            <button 
                onClick={hanldeSendSMS} 
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:outline-none focus:ring-blue-500 font-medium rounded-md text-[11px] px-2 py-1"
            >
                Send
            </button>
        </div>
    )
}
export default DriverDropDownForOrder