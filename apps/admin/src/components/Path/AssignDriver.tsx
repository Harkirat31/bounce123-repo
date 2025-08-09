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
    const isSendDisabled =
        dropDownItem === "Select" || (typeof dropDownItem !== "string" && dropDownItem.driverId === "Select");

    return (
        <div
            className={`absolute -left-10 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-3 min-w-[12rem] max-w-xs ${
                isAssignDivOpen ? "block" : "hidden"
            }`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-900">Assign to driver</div>
                <button
                    type="button"
                    onClick={() => setIsAssignDivOpen(false)}
                    className="inline-flex items-center justify-center w-6 h-6 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    aria-label="Close"
                >
                    ×
                </button>
            </div>

            {(pathData!.driverId == null || pathData!.driverId == undefined) ? (
                drivers.length === 0 ? (
                    <div>
                        <p className="text-sm text-gray-600">No drivers created.</p>
                        <button
                            type="button"
                            onClick={() => navigate('/drivers')}
                            className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Create driver
                        </button>
                    </div>
                ) : (
                    <div>
                        <label className="text-xs text-gray-700">Driver</label>
                        <select
                            ref={selectRef}
                            value={dropDownItem == "Select" ? "Select" : (dropDownItem as { driverId: string; driverName: string }).driverId}
                            onChange={(event) => handleDropdownChanged(event)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={"Select"}>Select a driver</option>
                            {drivers.map((driver: DriverType) => (
                                <option key={driver.uid} value={driver.uid}>{driver.name}</option>
                            ))}
                        </select>

                        <div className="mt-3 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsAssignDivOpen(false)}
                                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={hanldeSendSMS}
                                disabled={isSendDisabled}
                                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    isSendDisabled ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                <RiMailSendFill className="w-3.5 h-3.5 mr-1" />
                                Send
                            </button>
                        </div>
                    </div>
                )
            ) : (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-800">{pathData!.driverName}</p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsAssignDivOpen(false)}
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AssignDriver