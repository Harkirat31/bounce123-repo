import { useRecoilValue } from "recoil"
import { getDrivers } from "../../store/selectors/driversSelector"
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useRef } from "react";
import { DriverType, PathOrderType } from "types";
import { RiMailSendFill } from "react-icons/ri";

interface propsType {
    children?: React.ReactNode;
    pathData: PathOrderType,
    hanldeSendSMS: () => void,
    isAssignDivOpen: boolean,
    setIsAssignDivOpen: React.Dispatch<React.SetStateAction<boolean>>,
    dropDownItem: "Select" | {
    driverId: string;
    driverName: string;
},
    setDropDownItem: React.Dispatch<React.SetStateAction<"Select" | {
        driverId: string;
        driverName: string;
    }>>
}

const AssignDriver = ({ pathData, hanldeSendSMS, isAssignDivOpen, setIsAssignDivOpen, dropDownItem, setDropDownItem }: propsType) => {

    const drivers = useRecoilValue(getDrivers)
    const navigate = useNavigate()
    const selectRef = useRef<HTMLSelectElement | null>(null);


    function handleDropdownChanged(event: ChangeEvent<HTMLSelectElement>): void {
        setDropDownItem({ driverId: event.target.value, driverName: selectRef.current!.options[selectRef.current!.selectedIndex].text })
    }
    return <div className={`absolute -left-10  bg-gray-300 transition-all duration-2000 ease-in-out py-2 px-2 z-10 rounded ${isAssignDivOpen ? "scale-100" : "scale-0"}`}>
      
        <div className="flex flex-row">
            {(pathData!.driverId == null || pathData!.driverId == undefined)
                ?
                <>
                    {drivers.length == 0 ?
                        <>
                            <p className="text-nowrap">No Driver Created</p>
                            <a className="underline text-blue-900 ml-1 text-nowrap" onClick={() => navigate('/drivers')} >Create New</a>
                        </>
                        :
                        <select ref={selectRef} value={dropDownItem == "Select" ? "Select" : dropDownItem.driverId} onChange={(event) => handleDropdownChanged(event)} className="ml-2  border-2 border-blue-900 max-w-28" >
                            <option value={"Select"}>Select</option>
                            {drivers.map((driver: DriverType) => {
                                return <>
                                    <option value={driver.uid}>{driver.name}</option>
                                </>
                            })}
                        </select>}
                </>
                :
                <p>{pathData!.driverName}</p>
            }
            {drivers.length > 0 &&
                <button onClick={hanldeSendSMS} className="text-s">
                    <div className="flex flex-row items-center text-black ml-2">
                        Send
                        <RiMailSendFill />
                    </div>
                </button>}

        </div>
        <button className=" text-red-500 text-xs underline" type="button" onClick={()=>setIsAssignDivOpen(false)}>Close</button>

    </div>
}

export default AssignDriver