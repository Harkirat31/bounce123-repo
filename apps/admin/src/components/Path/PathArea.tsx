import { ChangeEvent, useEffect, useRef, useState } from "react"
import { SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { DriverType, PathOrderType } from "types"
import { createPathAtom, getSavedPathById, savedPathsAtom, updateOrders } from "../../store/atoms/pathAtom"
import { assignPathAPI, cancelPathAPI, deletePath } from "../../services/ApiService"
import { getDrivers } from "../../store/selectors/driversSelector"
import { getOrder, getOrderIds } from "../../store/selectors/orderSelector"
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit, MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import { RiMailSendFill } from "react-icons/ri";
//import { getPathById } from "../../store/selectors/pathSelector"
import { useNavigate } from "react-router-dom";
import CreatePath from "./CreatePath"
import { loadingState } from "../../store/atoms/loadingStateAtom"
import { TiDelete } from "react-icons/ti"
import { ordersSearchDate } from "../../store/atoms/orderAtom"
import { refreshData } from "../../store/atoms/refreshAtom";
import AssignDriver from "./AssignDriver"


const PathArea = () => {
    const [showCreatePath, setShowCreatePath] = useState<{ flag: boolean, toBeEditedPath: [PathOrderType,SetterOrUpdater<PathOrderType|undefined>]|null }>({ flag: false, toBeEditedPath: null }) //Pass id of editable path
    const paths = useRecoilValue(savedPathsAtom)
    // when user assign order directly to the driver , and also middle of creating some path, this refreshes
    useEffect(() => {
        setShowCreatePath({ flag: false, toBeEditedPath: null })
    }, [paths])
    return (
        <div className="border-t-2 border-grey-600">
            <div className="flex justify-center">
                <button onClick={() => setShowCreatePath({ flag: false, toBeEditedPath: null })} type="button" className={`m-2 text-sm ${showCreatePath.flag ? "text-black bg-gray-300" : "text-white bg-blue-700"}  px-2 py-1 rounded-lg`}>Show All Paths</button>
                <button onClick={() => setShowCreatePath({ flag: true, toBeEditedPath: null })} type="button" className={`m-2 text-sm ${!showCreatePath.flag ? "text-black bg-gray-300" : "text-white bg-blue-700"}  px-2 py-1 rounded-lg`}>Create Path</button>
            </div>
            {showCreatePath.flag && <CreatePath showCreatePath={showCreatePath} setShowCreatePath={setShowCreatePath}></CreatePath>}
            {!showCreatePath.flag && <Paths showCreatePath={showCreatePath} setShowCreatePath={setShowCreatePath}></Paths>}
        </div>
    )
}

export default PathArea

const Paths = ({ showCreatePath, setShowCreatePath }: {
    showCreatePath: { flag: boolean, toBeEditedPath: [PathOrderType,SetterOrUpdater<PathOrderType|undefined>]|null },
    setShowCreatePath: React.Dispatch<React.SetStateAction<{
        flag: boolean;
        toBeEditedPath: any;
    }>>
}) => {
    const paths = useRecoilValue(savedPathsAtom)
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
                        <th scope="col" className="px-1 py-3">
                            Metrics
                        </th>
                        {/* <th scope="col" className="py-3">
                            Assign To
                        </th> */}
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
        toBeEditedPath: [PathOrderType,SetterOrUpdater<PathOrderType|undefined>]|null;
    }>>
}) => {
    const [pathData, setPathData] = useRecoilState(getSavedPathById(path.pathId!))
    const setPathDataAtom = useSetRecoilState(getSavedPathById(path.pathId!))

    
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const [dropDownItem, setDropDownItem] = useState<{ driverId: string, driverName: string } | "Select">("Select")
    const updateOrder = useSetRecoilState(updateOrders)
    //const updateAfterCancel = useSetRecoilState(updateOrdersAfterCancel)
    const [allPaths, setAllPaths] = useRecoilState(savedPathsAtom)
    //const navigate = useNavigate()
    const setCreatePath = useSetRecoilState(createPathAtom)
    const setLoading = useSetRecoilState(loadingState)
    const refreshAllData = useSetRecoilState(refreshData)
    const [isAssignDivOpen,setIsAssignDivOpen] = useState(false)
   // const drivers = useRecoilValue(getDrivers)

   


    const handleShowToggle = () => {
        if (pathData!.show) {
            setPathDataAtom({ ...pathData!, show: false })
        }
        else {
            setPathDataAtom({ ...pathData!, show: true })
        }
    }
    // function handleDropdownChanged(event: ChangeEvent<HTMLSelectElement>): void {
    //     setDropDownItem({ driverId: event.target.value, driverName: selectRef.current!.options[selectRef.current!.selectedIndex].text })
    // }

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
        setLoading(true)
        assignPathAPI(pathArgs as PathOrderType).then((result) => {
            setPathData(pathArgs as PathOrderType)
            setLoading(false)
            refreshAllData(Date.now().toString())
            alert("Assigned and Sent to driver")
        }).catch((_error) => {
            setLoading(false)
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
                updateOrder(pathData!.path.map((p)=>p.id))

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
    const [undo, setUndo] = useState(false)

    const handleUndo = () => {
        setLoading(true)
        cancelPathAPI({ ...pathData! }).then((result: any) => {
            setUndo(false)
            
            // if (result.isCancelled) {
            //     //if all orders are not delivered , then path is deleted in db, so need to delete path at front end
            //     if (result.isPathDeleted) {
            //         let allPathsCopy = allPaths.filter((path) => {
            //             //removed path which is deleted
            //             if (path.pathId == pathData!.pathId) {
            //                 return false
            //             } else {
            //                 return true
            //             }
            //         })
            //         setAllPaths(allPathsCopy)
            //         updateOrder(pathData!.path)
            //     }
            //     else {
            //         updateAfterCancel(pathData!.path)
            //         setPathDataAtom({ ...pathData!, path: result.modifiedPath })
            //     }
            // }


            //this refresh the orders, paths
            refreshAllData(Date.now().toString())
        
        }).catch((error) => {
            alert("Failed")
        }).finally(() => {
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
            {/* pop up for cancelation of path, display is fixed */}
            {undo &&
                <div className={`${undo ? "flex" : "hidden"} z-50 left-0 top-0 flex-col justify-center items-center bottom-0 h-full fixed w-full  bg-black/40`}>
                    <div className="bg-white relative text-lg w-fit">
                        <TiDelete onClick={() => { setUndo(false) }} size={32} className="absolute right-0 top-0 cursor-pointer" />
                        <div className="pt-10 text-white   flex flex-wrap items-center justify-center">
                            {pathData.path.map((node) => {
                                return <div className="mt-2">
                                    <DisplayOrderData orderId={node.id}></DisplayOrderData>
                                </div>
                            })}
                        </div>
                        <button onClick={() => handleUndo()} className="bg-blue-700 text my-10 text-white p-2">Cancel Assignment</button>
                    </div>
                </div>}
            <tr className="border-b-2 border-gray-100 items-center">
                <td>
                    <input onChange={(event) => handleShowToggle()} type="checkbox" checked={pathData!.show} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2">
                    </input>
                   
                </td>
                <td>
                    <div className="grid grid-cols-3 w-28">
                        {pathData!.path.map((node) => {
                            return <DisplayOrderNumber orderId={node.id}></DisplayOrderNumber>
                        })}  
                    </div>
                </td>
                <td>
                    <div className="flex flex-col text-xs text-nowrap ml-2 items-start justify-start">
                        <p>{`${pathData.pathGeometry?.distanceInKm?.toFixed(2)} km`}</p>
                        <p>{`${pathData.pathGeometry?.durationInMins?.toFixed(2)} mins` }</p>
                       
                    </div>
                </td>
                {/* <td>
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

                </td> */}
                <td>

                    {(pathData!.driverId == null || pathData!.driverId == undefined) ?
                        <div  className="px-1 py-2 flex flex-row ">
                            
                            <div className="relative">
                                <button onClick={() => isAssignDivOpen?setIsAssignDivOpen(false): setIsAssignDivOpen(true)} className=" border-gray-300 border-r-2 p-1" type="button">
                                    <span className="flex flex-row items-center">Assign {!isAssignDivOpen ?<MdOutlineArrowDropDown size={20} /> :<MdOutlineArrowDropUp size={20} />}</span>
                                </button>
                                {<AssignDriver
                                    pathData={pathData}
                                    hanldeSendSMS={hanldeSendSMS}
                                    isAssignDivOpen={isAssignDivOpen}
                                    setIsAssignDivOpen={setIsAssignDivOpen}
                                    dropDownItem={dropDownItem}
                                    setDropDownItem={setDropDownItem}>
                                </AssignDriver>}
                            </div>
                            <button type="button" onClick={handleDelete} className="text-2xl border-gray-300 border-r-2 p-1"><AiFillDelete></AiFillDelete></button>
                            <button type="button" onClick={handleEdit} className="text-2xl border-gray-300 border-r-2 p-1"><MdEdit /></button>
                        </div>
                        :
                        <div className="flex flex-row">
                            <p className="ml-2 mr-2">Sent to {pathData.driverName}</p>
                            <button onClick={() => setUndo(true)} className=" border-gray-300 text-red-500 underline font-bold"> Undo</button>
                        </div>

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

const DisplayOrderData = ({ orderId }: { orderId: string }) => {
    const order = useRecoilValue(getOrder(orderId))

    return <div className="flex flex-col bg-blue-700 mx-1 p-2 text-center justify-center  border-gray-300">
        <div className="flex flex-row justify-center">
            <p className=" font-bold underline ">Order Id: </p>
            <p className="ml-2">{order?.orderNumber}</p>
        </div>
        <p className="">{order?.address}</p>
        <p className="">{order?.itemsDetail}</p>
        <div className="flex flex-row justify-center">
            <p className=" font-bold underline ">Order Status: </p>
            <p className="ml-2">{order?.currentStatus}</p>
        </div>
        <p className="text-sm">{order?.currentStatus == "Delivered" ? "(Delivered order cannot be cancelled)" : ""}</p>
    </div>
}
