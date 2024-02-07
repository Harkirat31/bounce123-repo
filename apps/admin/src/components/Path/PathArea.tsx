import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { DriverType, PathOrderType } from "types"
import { createPathAtom, savedPaths, savedPathsAtom, updateOrders } from "../../store/atoms/pathAtom"
import { assignPathAPI, deletePath } from "../../services/ApiService"
import { getDrivers } from "../../store/selectors/driversSelector"
import { getOrder, getOrderIds } from "../../store/selectors/orderSelector"
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from "react-icons/md";
import { RiMailSendFill } from "react-icons/ri";
import { getPathById } from "../../store/selectors/pathSelector"
import { useNavigate } from "react-router-dom";
import CreatePath from "./CreatePath"
import { loadingState } from "../../store/atoms/loadingStateAtom"

const PathArea = () => {
    const [showCreatePath, setShowCreatePath] = useState<{ flag: boolean, toBeEditedPath: any }>({ flag: false, toBeEditedPath: null }) //Pass id of editable path
    const paths = useRecoilValue(savedPathsAtom)
    // when user assign order directly to the driver , and also middle of creating some path, this refreshes
    useEffect(() => {
        setShowCreatePath({ flag: false, toBeEditedPath: null })
    }, [paths])
    return (
        <div className="border-t-2 border-grey-600">
            <div className="flex justify-center">
                <button onClick={() => setShowCreatePath({ flag: false, toBeEditedPath: null })} type="button" className={`m-2 text-sm ${showCreatePath.flag ? "text-black bg-gray-300" : "text-white bg-blue-700"}  px-2 py-1`}>Show All Paths</button>
                <button onClick={() => setShowCreatePath({ flag: true, toBeEditedPath: null })} type="button" className={`m-2 text-sm ${!showCreatePath.flag ? "text-black bg-gray-300" : "text-white bg-blue-700"}  px-2 py-1`}>Create Path</button>
            </div>
            {showCreatePath.flag && <CreatePath showCreatePath={showCreatePath} setShowCreatePath={setShowCreatePath}></CreatePath>}
            {!showCreatePath.flag && <Paths showCreatePath={showCreatePath} setShowCreatePath={setShowCreatePath}></Paths>}
        </div>
    )
}

export default PathArea

const Paths = ({ showCreatePath, setShowCreatePath }: {
    showCreatePath: { flag: boolean, toBeEditedPath: any },
    setShowCreatePath: React.Dispatch<React.SetStateAction<{
        flag: boolean;
        toBeEditedPath: any;
    }>>
}) => {
    const paths = useRecoilValue(savedPaths)
    const orderIds = useRecoilValue(getOrderIds)
    const navigate = useNavigate()

    const getSrNoFororderId = (orderId: string) => {
        return orderIds.findIndex((x) => x === orderId) + 1
    }

    return <div className="flex flex-col items-center">
        {orderIds.length === 0 && <div className="flex flex-col justify-center h-full text-center items-center">
            <p>No order is created for this day!!</p>
            <a className="underline text-blue-900" onClick={() => navigate('/orders')} >Create new orders</a>
        </div>}
        {orderIds.length !== 0 && paths.length === 0 && <div className="flex flex-col justify-center h-full text-center items-center">
            <p>No Path is created!!</p>
            <a className="underline text-blue-900" onClick={() => setShowCreatePath({ flag: true, toBeEditedPath: null })} >Create a Path</a>
        </div>}
        {orderIds.length > 0 && paths.length > 0 &&
            <table className="text-sm w-full text-center text-gray-500 ">
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




const PathRow = ({ path, callbackToCalculateSrNo, edit }: {
    path: PathOrderType, callbackToCalculateSrNo: (orderId: string) => number, edit: React.Dispatch<React.SetStateAction<{
        flag: boolean;
        toBeEditedPath: any;
    }>>
}) => {
    const [pathData, setPathData] = useRecoilState(getPathById(path.pathId!))
    const drivers = useRecoilValue(getDrivers)
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const [dropDownItem, setDropDownItem] = useState<{ driverId: string, driverName: string } | "Select">({ driverId: pathData!.driverId ? pathData!.driverId : "Select", driverName: pathData?.driverName ? pathData?.driverName : "Select" })
    const updateOrder = useSetRecoilState(updateOrders)
    const [allPaths, setAllPaths] = useRecoilState(savedPaths)
    const navigate = useNavigate()
    const setCreatePath = useSetRecoilState(createPathAtom)
    const setLoading = useSetRecoilState(loadingState)


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
        setLoading(true)
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
            setLoading(false)
        }
        ).catch((error) => {
            alert("Error Deleting Path")
            setLoading(false)
        })
    }

    const handleEdit = () => {
        if (pathData != null) {
            setPathData({ ...pathData, show: false })
            setCreatePath({ path: pathData!.path, pathId: pathData!.pathId! })
            edit({ flag: true, toBeEditedPath: [pathData, setPathData] })

        }

    }
    if (pathData) {
        return <>
            <tr className="border-b-2 border-gray-100">
                <td> <input onChange={(event) => handleShowToggle()} type="checkbox" checked={pathData!.show} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"></input></td>
                <td>
                    <div className="grid grid-cols-3">
                        {pathData!.path.map((node) => {
                            return <DisplayOrderNumber orderId={node}></DisplayOrderNumber>
                        })}
                    </div>
                </td>
                <td>
                    {
                        <>
                            {(pathData!.driverId == null || pathData!.driverId == undefined)
                                ?
                                <>
                                    {drivers.length == 0 ?
                                        <>
                                            <p>No Driver Created</p>
                                            <a className="underline text-blue-900" onClick={() => navigate('/drivers')} >Create New</a>
                                        </>
                                        :
                                        <select ref={selectRef} value={dropDownItem == "Select" ? "Select" : dropDownItem.driverId} onChange={(event) => handleDropdownChanged(event)} className="ml-2  border-2 border-blue-900" >
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
                        </>
                    }

                </td>
                <td className="px-6 py-4 flex">

                    {(pathData!.driverId == null || pathData!.driverId == undefined) ?
                        <>
                            {drivers.length > 0 &&
                                <button onClick={hanldeSendSMS} className="text-s">
                                    <div className="flex flex-row items-center border-gray-300 border-r-2 p-1 ">
                                        Send
                                        <RiMailSendFill />
                                    </div>
                                </button>}
                            <button type="button" onClick={handleDelete} className="text-2xl border-gray-300 border-r-2 p-1"><AiFillDelete></AiFillDelete></button>
                            <button type="button" onClick={handleEdit} className="text-2xl border-gray-300 border-r-2 p-1"><MdEdit /></button>
                        </>
                        :
                        <p className="ml-2">Sent</p>
                    }


                </td>

            </tr>

        </>
    }
    else {
        return <></>
    }
}


const DisplayOrderNumber = ({ orderId }: { orderId: string }) => {
    const order = useRecoilValue(getOrder(orderId))

    return <p className="text-center w-fit  px-1.5 mx-0.5 my-0.5 text-black bg-red-400 border-gray-300 rounded-xl">{order ? (order.orderNumber!.length > 3 ? `..${order.orderNumber!.slice(-3)}` : order.orderNumber) : "NA"}</p>
}