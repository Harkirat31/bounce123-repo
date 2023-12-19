import { ChangeEvent, useRef, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { DriverType, PathOrderType } from "types"
import { createPathAtom, savedPaths, updateOrders } from "../../store/atoms/pathAtom"
import { assignPathAPI, deletePath } from "../../services/ApiService"
import { getDrivers } from "../../store/selectors/driversSelector"
import { getOrderIds } from "../../store/selectors/orderSelector"
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from "react-icons/md";
import { RiMailSendFill } from "react-icons/ri";
import { getPathById } from "../../store/selectors/pathSelector"
import { useNavigate } from "react-router-dom";
import CreatePath from "./CreatePath"

const PathArea = () => {
    const [showCreatePath, setShowCreatePath] = useState(false)
    return (
        <div className="border-t-2 border-grey-600">
            <div className="flex justify-center">
                <button onClick={() => setShowCreatePath(false)} type="button" className={`m-2 text-sm ${showCreatePath ? "text-black bg-gray-300" : "text-white bg-blue-700"}  px-2 py-1`}>Show All Paths</button>
                <button onClick={() => setShowCreatePath(true)} type="button" className={`m-2 text-sm ${!showCreatePath ? "text-black bg-gray-300" : "text-white bg-blue-700"}  px-2 py-1`}>Create Path</button>
            </div>
            {showCreatePath && <CreatePath setShowCreatePath={setShowCreatePath}></CreatePath>}
            {!showCreatePath && <Paths setShowCreatePath={setShowCreatePath}></Paths>}
        </div>
    )
}

export default PathArea

const Paths = ({ setShowCreatePath }: { setShowCreatePath: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const paths = useRecoilValue(savedPaths)
    const orderIds = useRecoilValue(getOrderIds)
    const navigate = useNavigate()

    const getSrNoFororderId = (orderId: string) => {
        return orderIds.findIndex((x) => x === orderId) + 1
    }

    return <div className="flex flex-col items-center ">
        {orderIds.length === 0 && <div className="flex flex-col justify-center h-full text-center items-center">
            <p>No order is created for this day!!</p>
            <a className="underline text-blue-900" onClick={() => navigate('/orders')} >Create new orders</a>
        </div>}
        {orderIds.length !== 0 && paths.length === 0 && <div className="flex flex-col justify-center h-full text-center items-center">
            <p>No Path is created!!</p>
            <a className="underline text-blue-900" onClick={() => setShowCreatePath(true)} >Create a Path</a>
        </div>}
        {orderIds.length > 0 && paths.length > 0 &&
            <table className="text-sm  text-center text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-1 py-1 ">
                            Show
                        </th>
                        <th scope="col" className="px-1 py-3">
                            Path
                        </th>
                        <th scope="col" className="py-3">
                            Assign To
                        </th>
                        <th scope="col" className="px-1 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paths.length > 0 &&
                        paths.map((pathElement) => {
                            return <PathRow path={pathElement} callbackToCalculateSrNo={getSrNoFororderId} edit={setShowCreatePath} ></PathRow>
                        })
                    }
                </tbody>
            </table>
        }

    </div>
}




const PathRow = ({ path, callbackToCalculateSrNo, edit }: { path: PathOrderType, callbackToCalculateSrNo: (orderId: string) => number, edit: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [pathData, setPathData] = useRecoilState(getPathById(path.pathId!))
    const drivers = useRecoilValue(getDrivers)
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const [dropDownItem, setDropDownItem] = useState<{ driverId: string, driverName: string } | "Select">({ driverId: pathData!.driverId ? pathData!.driverId : "Select", driverName: pathData?.driverName ? pathData?.driverName : "Select" })
    const updateOrder = useSetRecoilState(updateOrders)
    const [allPaths, setAllPaths] = useRecoilState(savedPaths)
    const navigate = useNavigate()
    const setCreatePath = useSetRecoilState(createPathAtom)

    const handleShowToggle = () => {
        if (pathData!.show) {
            setPathData({ ...pathData!, show: false })
        }
        else {
            setPathData({ ...pathData!, show: true })
        }
    }
    function handleDropdownChanged(event: ChangeEvent<HTMLSelectElement>): void {
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

        let pathArgs = { ...pathData, driverId: dropDownItem.driverId, driverName: dropDownItem.driverName }

        assignPathAPI(pathArgs as PathOrderType).then((result) => {
            setPathData(pathArgs as PathOrderType)
            //alert("Assigned and Sent to driver")
        }).catch((_error) => {
            alert("Error")
        })


    }

    const handleDelete = () => {
        deletePath(pathData).then((result: any) => {
            if (result.isDeleted) {
                // Reather than setting date, fetch paths and set paths
                let allPathsCopy = allPaths.filter((path) => {
                    //removed path which is deleted
                    if (path.pathId == pathData!.pathId) {
                        return false
                    } else {
                        return true
                    }
                })
                setAllPaths(allPathsCopy)
                updateOrder(pathData!.path)
            }
            if (result.err != null || result.err != undefined) {
                alert("Error Deleting Path")
            }
        }
        )
    }

    const handleEdit = () => {
        setCreatePath({ path: pathData!.path, pathId: pathData!.pathId! })
        edit(true)
    }
    if (pathData) {
        return <>
            <tr className="border-b-2 border-gray-100">
                <td> <input onChange={(event) => handleShowToggle()} type="checkbox" checked={pathData!.show} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"></input></td>
                <td>
                    <div className="grid grid-cols-4">
                        {pathData!.path.map((node) => {
                            return <p className="text-center w-5 h-5 mx-2 my-0.5 text-black bg-red-400 border-gray-300 rounded-xl">{callbackToCalculateSrNo(node)}</p>

                        })}
                    </div>
                </td>
                <td>
                    {drivers.length == 0 &&
                        <>
                            <p>No Driver Created</p>
                            <a className="underline text-blue-900" onClick={() => navigate('/drivers')} >Create New</a>
                        </>
                    }
                    {
                        drivers.length > 0 && <>
                            {(pathData!.driverId == null || pathData!.driverId == undefined) ?
                                <select ref={selectRef} value={dropDownItem == "Select" ? "Select" : dropDownItem.driverId} onChange={(event) => handleDropdownChanged(event)} className="ml-2  border-2 border-blue-900" >
                                    <option value={"Select"}>Select</option>

                                    {drivers.map((driver: DriverType) => {
                                        return <>
                                            <option value={driver.uid}>{driver.name}</option>
                                        </>
                                    })}
                                </select>
                                :
                                <p>{pathData!.driverName}</p>
                            }
                        </>
                    }

                </td>
                <td className="px-6 py-4 flex">
                    {drivers.length == 0 && <>
                        N/A
                    </>}
                    {drivers.length > 0 && <>
                        {(pathData!.driverId == null || pathData!.driverId == undefined) ?
                            <>

                                <button onClick={hanldeSendSMS} className="text-s">
                                    <div className="flex flex-row items-center border-gray-300 border-r-2 p-1 ">
                                        Send
                                        <RiMailSendFill />
                                    </div>
                                </button>
                                <button type="button" onClick={handleDelete} className="text-2xl border-gray-300 border-r-2 p-1"><AiFillDelete></AiFillDelete></button>
                                <button type="button" onClick={handleEdit} className="text-2xl border-gray-300 border-r-2 p-1"><MdEdit /></button>
                            </>
                            :
                            <p className="ml-2">Sent</p>
                        }
                    </>}

                </td>

            </tr>

        </>
    }
    else {
        return <></>
    }
}