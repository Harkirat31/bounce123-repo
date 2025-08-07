import { useEffect, useState } from "react"
import { SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import {  PathOrderType } from "types"
import { createPathAtom, getSavedPathById, savedPathsAtom, updateOrders } from "../../store/atoms/pathAtom"
import { assignPathAPI, cancelPathAPI, deletePath } from "../../services/ApiService"
import { getOrder, getOrderIds } from "../../store/selectors/orderSelector"
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit, MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";

//import { getPathById } from "../../store/selectors/pathSelector"
import { useNavigate } from "react-router-dom";
import { loadingState } from "../../store/atoms/loadingStateAtom"
import { TiDelete } from "react-icons/ti"
//import { ordersSearchDate } from "../../store/atoms/orderAtom"
import { refreshData } from "../../store/atoms/refreshAtom";
import AssignDriver from "./AssignDriver"
import { isRoadView } from "../../store/atoms/commonAtoms"
import { CreatePathV2 } from "./CreatePath_V2"

import { PathExpand } from "./PathExpand"


const PathArea = () => {
    const [showCreatePath, setShowCreatePath] = useState<{ flag: boolean, toBeEditedPath: [PathOrderType,SetterOrUpdater<PathOrderType|undefined>]|null }>({ flag: false, toBeEditedPath: null }) //Pass id of editable path
    const paths = useRecoilValue(savedPathsAtom)
    const [isRoad,setIsRoad] = useRecoilState(isRoadView)
    // when user assign order directly to the driver , and also middle of creating some path, this refreshes
    useEffect(() => {
        setShowCreatePath({ flag: false, toBeEditedPath: null })
    }, [paths])
    return (
        <div className="border-t-2 border-grey-600">
            <div className="flex justify-center">
                <button onClick={() => setShowCreatePath({ flag: false, toBeEditedPath: null })} type="button" className={`m-2 text-sm ${showCreatePath.flag ? "text-black bg-gray-300" : "text-white bg-blue-700"}  px-2 py-1 rounded-lg`}>Show All Paths</button>
                <button onClick={() => setShowCreatePath({ flag: true, toBeEditedPath: null })} type="button" className={`m-2 text-sm ${!showCreatePath.flag ? "text-black bg-gray-300" : "text-white bg-blue-700"}  px-2 py-1 rounded-lg`}>Create Path</button>
                <div className="flex flex-row items-center">
                    <label className="text-sm ">Road View</label>
                    <input checked={isRoad} onChange={()=>setIsRoad(!isRoad)} className="m-2" type="checkbox"></input>
                </div>
                
            </div>
            {/* {showCreatePath.flag && <CreatePath showCreatePath={showCreatePath} setShowCreatePath={setShowCreatePath}></CreatePath>} */}
            {showCreatePath.flag && <CreatePathV2 showCreatePath={showCreatePath} setShowCreatePath={setShowCreatePath}></CreatePathV2>}
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
            <div className="w-full space-y-4">
                {paths.length > 0 &&
                    paths.map((pathElement) => {
                        return <PathRow key={pathElement.pathId} path={pathElement} callbackToCalculateSrNo={getSrNoFororderId} edit={setShowCreatePath} />
                    })
                }
            </div>
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

    
   // const selectRef = useRef<HTMLSelectElement | null>(null);
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
        setLoading({isLoading:true,value:"Sending to Driver. Please Wait..."})
        assignPathAPI(pathArgs as PathOrderType).then((result) => {
            setPathData(pathArgs as PathOrderType)
            setLoading({isLoading:false,value:null})
            refreshAllData(Date.now().toString())
            alert("Assigned and Sent to driver")
        }).catch((_error) => {
            setLoading({isLoading:false,value:null})
            alert("Error")
        })
    }

    const handleDelete = () => {
        setLoading({isLoading:true,value:"Deleting Path. Please Wait..."})
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
            setLoading({isLoading:false,value:null})
        }
        ).catch((error) => {
            alert("Error Deleting Path")
            setLoading({isLoading:false,value:null})
        })
    }
    const [undo, setUndo] = useState(false)

    const handleUndo = () => {
        setLoading({isLoading:true,value:"Please Wait..."})
        cancelPathAPI({ ...pathData! }).then((result: any) => {
            setUndo(false)
            refreshAllData(Date.now().toString())
        
        }).catch((error) => {
            alert("Failed")
        }).finally(() => {
            setLoading({isLoading:false,value:null})
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
                <div className={`${undo ? "flex" : "hidden"} z-50 left-0 top-0 flex-col justify-center items-center bottom-0 h-full fixed w-full bg-black bg-opacity-50 backdrop-blur-sm`}>
                    <div className="w-96 md:w-[95%] max-w-7xl h-[90%] md:h-[75%] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col p-6 animate-slide-up relative">
                        <div className="absolute -top-2 -right-2 z-10">
                            <button
                                onClick={() => setUndo(false)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium text-sm shadow-md transition-colors duration-200 flex items-center gap-x-2"
                            >
                                <span>✕</span>
                            </button>
                        </div>

                        <div className="w-full h-full flex flex-col text-black overflow-hidden">
                            <div className="bg-red-50 rounded-lg p-4 mb-4 border border-red-200">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-red-800">Cancel Path Assignment</h3>
                                </div>
                                <p className="text-sm text-red-700 mt-2">
                                    This will cancel the assignment of this path to {pathData.driverName}.
                                </p>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex flex-col md:flex-row gap-x-4 mt-2 gap-y-2 w-full h-[50vh] md:h-72 overflow-scroll items-center text-xs">
                                    {pathData.path.length === 0 ? (
                                        <div className="text-gray-500 text-center w-full py-4">
                                            No orders in this path
                                        </div>
                                    ) : (
                                        pathData.path.map((order, index) => (
                                            <DisplayOrderData key={order.id} orderId={order.id} />
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-center">
                                <button 
                                    onClick={() => handleUndo()} 
                                    className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel Assignment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}
                
            <div className={`mb-4 mx-2 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm overflow-hidden ${
                pathData!.show 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3 flex-col gap-2">
                    {/* Left side - Toggle and Metrics */}
                    <div className="flex items-center w-full justify-between ">
                        {/* Show/Hide Toggle */}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                onChange={handleShowToggle} 
                                type="checkbox" 
                                checked={pathData!.show} 
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-2 text-xs font-medium text-gray-700">
                                {pathData!.show ? 'Visible' : 'Hidden'}
                            </span>
                        </label>

                        {/* Metrics */}
                        <div className="flex items-center space-x-3 text-xs">
                            <div className="flex items-center space-x-1">
                                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span className="font-medium text-gray-700">
                                    {pathData.pathGeometry?.distanceInKm?.toFixed(2)} km
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium text-gray-700">
                                    {pathData.pathGeometry?.durationInMins?.toFixed(0)} min
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center w-full justify-around">
                        {/* Path Expand Button */}
                        <div className="relative">
                            <PathExpand pathData={pathData!} />
                        </div>

                        {/* Driver Assignment Status */}
                        {(pathData!.driverId == null || pathData!.driverId == undefined) ? (
                            <div className="flex items-center space-x-1">
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsAssignDivOpen(!isAssignDivOpen)} 
                                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-colors"
                                    >
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Assign
                                        {!isAssignDivOpen ? 
                                            <MdOutlineArrowDropDown size={12} className="ml-1" /> : 
                                            <MdOutlineArrowDropUp size={12} className="ml-1" />
                                        }
                                    </button>
                                    <AssignDriver
                                        pathData={pathData}
                                        hanldeSendSMS={hanldeSendSMS}
                                        isAssignDivOpen={isAssignDivOpen}
                                        setIsAssignDivOpen={setIsAssignDivOpen}
                                        dropDownItem={dropDownItem}
                                        setDropDownItem={setDropDownItem}
                                    />
                                </div>
                                
                                <button 
                                    onClick={handleEdit}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition-colors"
                                >
                                    <MdEdit className="w-3 h-3 mr-1" />
                                    Edit
                                </button>
                                
                                <button 
                                    onClick={handleDelete}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:ring-2 focus:ring-red-300 transition-colors"
                                >
                                    <AiFillDelete className="w-3 h-3 mr-1" />
                                    Delete
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                {/* Driver Status Badge */}
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    pathData.isAcceptedByDriver === true 
                                        ? 'bg-green-100 text-green-800' 
                                        : pathData.isAcceptedByDriver === false 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {pathData.isAcceptedByDriver === true && (
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Accepted by {pathData.driverName}</span>
                                        </div>
                                    )}
                                    {pathData.isAcceptedByDriver === false && (
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                            <span>Rejected by {pathData.driverName}</span>
                                        </div>
                                    )}
                                    {pathData.isAcceptedByDriver === undefined && (
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Pending - {pathData.driverName}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={() => setUndo(true)}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 focus:ring-2 focus:ring-red-300 transition-colors"
                                >
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                    Undo
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Orders Grid */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-600">Orders ({pathData!.path.length}):</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1">
                        {pathData!.path.map((node, index) => (
                            <div key={node.id} className="flex items-center">
                                <DisplayOrderNumber 
                                    orderId={node.id} 
                                    nextOrderId={pathData.nextOrderToBeDelivered}
                                />
                                {index < pathData!.path.length - 1 && (
                                    <svg className="w-4 h-4 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    }
    else {
        return <></>
    }
}


const DisplayOrderNumber = ({ orderId,nextOrderId }: { orderId: string,nextOrderId:string|undefined }) => {
    const order = useRecoilValue(getOrder(orderId))
    
    if(nextOrderId && nextOrderId==order?.orderId && order.currentStatus=="SentToDriver"){
        return (
            <div className={`flex items-center justify-center px-1.5 py-1 text-xs font-medium rounded bg-orange-100 text-orange-800 border border-orange-200 animate-pulse min-w-[2rem]`}>
                {order ? (order.orderNumber!.length > 3 ? `..${order.orderNumber!.slice(-3)}` : order.orderNumber) : "NA"}
            </div>
        )
    }
    
    return (
        <div className={`flex items-center justify-center px-1.5 py-1 text-xs font-medium rounded min-w-[2rem] ${
            order?.currentStatus=="Delivered" 
                ? "bg-green-100 text-green-800 border border-green-200" 
                : "bg-red-100 text-red-800 border border-red-200"
        }`}>
            {order ? (order.orderNumber!.length > 3 ? `..${order.orderNumber!.slice(-3)}` : order.orderNumber) : "NA"}
        </div>
    )
}

const DisplayOrderData = ({ orderId }: { orderId: string }) => {
    const order = useRecoilValue(getOrder(orderId))

    return (
        <div className="flex-shrink-0 w-64 border border-gray-300 rounded-md p-3 bg-gray-50 overflow-y-auto">
            <div className="flex flex-col gap-y-2">
                <div className="flex flex-row items-center justify-between">
                    <p className="text-blue-600 font-semibold text-sm">Order ID: {order?.orderNumber || order?.orderId || 'N/A'}</p>
                    <div className="flex items-center gap-x-2">
                        <p className={`px-2 py-1 rounded text-xs font-medium ${order?.priority === 'High' ? 'bg-red-100 text-red-700' :
                                order?.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    order?.priority === 'Special' ? 'bg-purple-100 text-purple-700' :
                                        'bg-green-100 text-green-700'
                            }`}>{order?.priority}</p>
                    </div>
                </div>

                <div className="text-xs">
                    <p className="text-gray-700 mb-2">{order?.cname}</p>
                </div>

                <div className="flex flex-col gap-y-1 text-xs">
                    <div className="flex items-start gap-x-1">
                        <svg className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-700 line-clamp-2 text-left">{order?.address}</p>
                    </div>

                    <div className="flex items-center gap-x-1">
                        <svg className="w-3 h-3 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <p className="text-gray-700 text-left">{order?.cphone}</p>
                    </div>

                    {order?.cemail && (
                        <div className="flex items-center gap-x-1">
                            <svg className="w-3 h-3 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-700 truncate text-left">{order?.cemail}</p>
                        </div>
                    )}
                </div>
                
                {order?.itemsDetail && (
                    <div className="mt-1">
                        <div className="flex items-start gap-x-1">
                            <svg className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p className="text-xs text-gray-700 line-clamp-2 text-left">{order?.itemsDetail}</p>
                        </div>
                    </div>
                )}

                {order?.specialInstructions && (
                    <div className="mt-1">
                        <p className="text-blue-600 text-xs font-medium mb-1 text-left">Instructions:</p>
                        <p className="text-xs text-gray-700 line-clamp-2 text-left">{order?.specialInstructions}</p>
                    </div>
                )}

                <div className="mt-auto pt-2">
                    <p className={`px-2 py-1 rounded text-xs font-medium text-center ${order?.currentStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order?.currentStatus === 'OnTheWay' ? 'bg-blue-100 text-blue-700' :
                                order?.currentStatus === 'Accepted' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                        }`}>{order?.currentStatus}</p>
                    
                    {order?.currentStatus === "Delivered" && (
                        <p className="text-xs text-red-600 italic text-center mt-1 font-medium">(Delivered order cannot be cancelled)</p>
                    )}
                </div>
            </div>
        </div>
    )
}
