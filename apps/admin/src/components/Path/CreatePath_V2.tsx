import { useEffect, useRef, useState } from "react"
import { SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { createPathAtom, orderSetForAtom, orderSetForPathCreation } from "../../store/atoms/pathAtom";
import { getOrderIds, getOrder } from "../../store/selectors/orderSelector";
import { ordersAtom, ordersSearchDate } from "../../store/atoms/orderAtom";
import { createPath } from "../../services/ApiService";
import { userAtom } from "../../store/atoms/userAtom";
import { FaLongArrowAltDown } from "react-icons/fa";
import { AiFillDelete } from 'react-icons/ai';
import { convertToUTC } from "../../utils/UTCdate";
import { PathOrderType } from "types";
import { refreshData } from "../../store/atoms/refreshAtom";
import { GenerateOptimizedPaths } from "./GenerateOptimizedPaths";
import { MdDoneOutline, MdClose, MdSave, MdRefresh, MdLocationOn } from "react-icons/md";
import { GiClick } from "react-icons/gi";
import { FaRoute } from "react-icons/fa";

// New OrderCard Component
const OrderCard = ({ orderId, index, onDelete, onDragStart, onDrop, onDragOver }: {
    orderId: string;
    index: number;
    onDelete: (ev: any) => void;
    onDragStart: (ev: any) => void;
    onDrop: (ev: any) => void;
    onDragOver: (ev: any) => void;
}) => {
    const order = useRecoilValue(getOrder(orderId));
    
    if (!order) return null;

    return (
        <div
            data-id={`${index}`}
            id={`p${orderId}`}
            onDragStart={onDragStart}
            draggable="true"
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="group relative bg-white border border-blue-200 hover:border-blue-400 rounded p-2 shadow-sm hover:shadow transition-all duration-200 cursor-move w-full max-w-xs"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-1.5 flex-1 min-w-0">
                    <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        {/* Order Number Row */}
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-gray-900 truncate">
                                Order #{order.orderNumber || order.orderId}
                            </p>
                            <p className="text-xs text-gray-500 ml-1">
                                {order.priority}
                            </p>
                        </div>
                        
                        {/* Address Row */}
                        <div className="flex items-start space-x-1 mb-1">
                            <MdLocationOn className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-700 line-clamp-1 leading-tight">
                                {order.address || 'No address'}
                            </p>
                        </div>
                        
                        {/* Details Row */}
                        <div className="flex items-start space-x-1">
                            <svg className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p className="text-xs text-gray-600 line-clamp-1 leading-tight">
                                {order.itemsDetail || 'No details'}
                            </p>
                        </div>
                    </div>
                </div>
                
                <button
                    data-id={`${index}`}
                    data-id-node={`${index}`}
                    onClick={onDelete}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-all duration-200 flex-shrink-0"
                >
                    <AiFillDelete className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export const CreatePathV2 = ({ showCreatePath, setShowCreatePath }: {
    showCreatePath: { flag: boolean, toBeEditedPath: [PathOrderType, SetterOrUpdater<PathOrderType | undefined>] | null },
    setShowCreatePath: React.Dispatch<React.SetStateAction<{
        flag: boolean;
        toBeEditedPath: any;
    }>>
}) => {

    const [pathOrders, setPathOrders] = useRecoilState(createPathAtom)
    const orderIds = useRecoilValue(getOrderIds)
    const orders = useRecoilValue(ordersAtom)
    const [orderSetForPath, setorderSetForPath] = useRecoilState(orderSetForPathCreation)
    const [reset, setReset] = useState(false)
    const date = useRecoilValue(ordersSearchDate)
    const [saving, setSaving] = useState(false)
    const user = useRecoilValue(userAtom)
    const changeCreatePathOrderSet = useSetRecoilState(orderSetForAtom)
    const saved = useRef(false) // weather path saved or not 

    const refreshAllData = useSetRecoilState(refreshData)

    useEffect(() => {
        setorderSetForPath([...orderIds] as string[])
        if (reset) {
            setPathOrders({ path: [], pathId: undefined })
            if (showCreatePath.toBeEditedPath) {
                showCreatePath.toBeEditedPath[1]({ ...showCreatePath.toBeEditedPath[0], show: true })
            }
            setShowCreatePath({ flag: true, toBeEditedPath: null })
        }
        return () => {

            if (showCreatePath.toBeEditedPath && !saved.current) {
                showCreatePath.toBeEditedPath[1]({ ...showCreatePath.toBeEditedPath[0], show: true })
            }

            setPathOrders({ path: [], pathId: undefined })


        }
    }, [reset])


    const getLocationOfOrder = (orderId: string) => {
        return orders.find((x) => x.orderId === orderId)?.location
    }

    const getOrderNumberFororderId = (orderId: string) => {
        return orders.find((x) => x.orderId === orderId)?.orderNumber
    }

    const handleOrderClick = (id: string) => {
        setPathOrders({ path: [...pathOrders.path, { id: id, latlng: getLocationOfOrder(id) }], pathId: pathOrders.pathId })
        let newSet = orderSetForPath.filter((orderId: any) => orderId != id)
        changeCreatePathOrderSet([...newSet])

    }


    const onDropHandler = (ev: any) => {
        const data = ev.dataTransfer.getData("application/my-app");
        try {
            let startPosition = parseInt((ev.currentTarget).getAttribute('data-id'))
            let removedElementPosition = parseInt(data)
            if (startPosition == removedElementPosition) {
                ev.preventDefault();
            }
            let pathOrderCopy = [...pathOrders.path]
            let removedElement = pathOrderCopy[removedElementPosition]
            //let shiftStartElement = pathOrderCopy[startPosition]

            if (startPosition < removedElementPosition) {
                pathOrderCopy.splice(startPosition, 0, removedElement)
                pathOrderCopy.splice(removedElementPosition + 1, 1)
            } else {
                pathOrderCopy.splice(startPosition + 1, 0, removedElement)
                pathOrderCopy.splice(removedElementPosition, 1)
            }
            setPathOrders({ path: pathOrderCopy, pathId: pathOrders.pathId })
        }
        catch {

        }

    }
    const onDragStartHandler = (ev: any) => {
        ev.dataTransfer.setData("application/my-app", (ev.target).getAttribute('data-id'));
    }
    const onDragOverHandler = (ev: any) => {
        ev.preventDefault();

    }

    const onSaveClick = () => {
        let newDate = convertToUTC(date)
        setSaving(true)
        // this method create path if path is undefined else update existing path

        //this can be changed if user after multiple location in future
        //if it is undefined , lat.lng:0,0
        //in future , we will make sure to have starting location of path
        const startingLocation = user?.location ?? { lat: 0, lng: 0 }
        createPath({ show: true, path: pathOrders.path, dateOfPath: newDate, pathId: pathOrders.pathId, startingLocation }).then((result) => {
            setSaving(false)
            saved.current = true
            setShowCreatePath({ toBeEditedPath: null, flag: false })

            //this will refresh whole data
            refreshAllData(Date.now().toString())

        }).catch((error) => {
            alert(error)
            setSaving(false)
        })

    }

    const handleDeleteNode = (ev: any) => {
        try {
            let index = parseInt(ev.currentTarget.getAttribute('data-id-node'))
            let updatedPath = [...pathOrders.path]
            let deleteNodeValue = updatedPath[index]
            updatedPath.splice(index, 1)
            let updatedPathOrders = { path: updatedPath, pathId: pathOrders.pathId }
            setPathOrders(updatedPathOrders)
            //main atom of creating path has been updated
            changeCreatePathOrderSet([deleteNodeValue.id, ...orderSetForPath])
        }
        catch (error) {

        }
        
    }

    return (
        <div className="fixed top-[35%] left-2 right-2 h-[60vh] xl:right-10 xl:top-20 xl:bottom-20 xl:left-auto xl:w-[24vw] 2xl:w-[26vw] xl:h-[80vh] bg-white shadow-lg z-50 flex flex-col overflow-hidden rounded-lg border max-w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                    <FaRoute className="w-4 h-4" />
                    <h2 className="text-sm font-semibold">Create New Route</h2>
                </div>
                <button 
                    onClick={() => setShowCreatePath({ flag: false, toBeEditedPath: null })}
                    className="p-0.5 hover:bg-blue-800 rounded transition-colors"
                >
                    <MdClose className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Optimization Section */}
                <div className="p-2 border-b border-gray-200">
                    <GenerateOptimizedPaths />
                </div>

                {/* Available Orders */}
                <div className="p-2 border-b border-gray-200">
                    <h3 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                        Available ({orderSetForPath.length})
                    </h3>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {orderSetForPath.length > 0 && orderSetForPath.map((orderId: any) => (
                            <button
                                key={orderId}
                                onClick={() => handleOrderClick(orderId)}
                                className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-xs font-medium transition-colors duration-150 hover:scale-105"
                            >
                                {getOrderNumberFororderId(orderId)}
                            </button>
                        ))}
                        {orderSetForPath.length === 0 && (
                            <div className="flex items-center space-x-1 p-2 bg-green-50 rounded border border-green-200 w-full">
                                <MdDoneOutline className="w-3 h-3 text-green-600" />
                                <span className="text-xs text-green-700 font-medium">All Added</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Route Path */}
                <div className="flex-1 p-2 overflow-y-auto">
                    <h3 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                        Route ({pathOrders.path.length})
                    </h3>
                    
                    {pathOrders.path.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-4 text-gray-500">
                            <GiClick className="w-6 h-6 mb-1 text-gray-400" />
                            <p className="text-xs text-center">Click orders to build route</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {/* Starting Point */}
                            {pathOrders.path.length > 0 && user && (
                                <div className="flex items-center justify-center">
                                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1.5 rounded text-xs font-medium shadow-sm">
                                        <span className="flex items-center space-x-1">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                            <span>{user.companyName}</span>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Route Orders */}
                            {pathOrders.path.map((pathnode, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <FaLongArrowAltDown className="w-3 h-3 text-gray-400 my-0.5" />
                                    <OrderCard
                                        orderId={pathnode.id}
                                        index={index}
                                        onDelete={handleDeleteNode}
                                        onDragStart={onDragStartHandler}
                                        onDrop={onDropHandler}
                                        onDragOver={onDragOverHandler}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {pathOrders.path.length > 0 && (
                    <div className="p-2 border-t border-gray-200 bg-gray-50">
                        <div className="flex space-x-2">
                            <button
                                onClick={onSaveClick}
                                disabled={saving}
                                className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200"
                            >
                                <MdSave className="w-3 h-3" />
                                <span>{saving ? "Saving..." : "Save"}</span>
                            </button>
                            <button
                                onClick={() => reset ? setReset(false) : setReset(true)}
                                className="flex items-center justify-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200"
                            >
                                <MdRefresh className="w-3 h-3" />
                                <span>Reset</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
