import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaBoxOpen } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { PathOrderType, } from "types";
import { useRecoilValue } from "recoil";
import { getOrder } from "../../store/selectors/orderSelector";


interface PathExpandProps {
    pathData: PathOrderType;
}

export const PathExpand = ({ pathData }: PathExpandProps) => {
    const [open, setOpen] = useState(false)

    return <>
        <button onClick={() => {
            setOpen(true)
        }} className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 focus:ring-2 focus:ring-blue-300 transition-colors">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Details
        </button>
        {open &&
            <div className="fixed bottom-0 left-0 right-0   h-[90%] md:h-[55%] bg-black bg-opacity-50 z-50 flex items-end justify-center backdrop-blur-sm">
                <div className="w-96 md:w-[95%] max-w-7xl h-full bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 flex flex-col p-6 animate-slide-up relative">
                 <div className="absolute -top-2 -right-2 z-10">
                        <button
                            onClick={() => setOpen(false)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg font-medium text-sm shadow-md transition-colors duration-200 flex items-center gap-x-2"
                        >
                            <span>✕</span>
                        </button>
                    </div>

                    <div className="w-full h-full flex flex-col text-black overflow-hidden ">
                    
                        <div className="bg-gray-50 rounded-lg p-2 mb-2 border border-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-y-2">
                                <div >
                                    <p className="text-gray-600 text-xs"> Estimated Route Distance</p>
                                    <p className="text-gray-900 font-semibold text-xs">
                                        {pathData.pathGeometry?.distanceInKm ? `${pathData.pathGeometry.distanceInKm.toFixed(2)} km` : 'N/A'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-xs">Estimated Time</p>
                                    <p className="text-gray-900 font-semibold text-xs">
                                        {pathData.pathGeometry?.durationInMins ? `${pathData.pathGeometry.durationInMins.toFixed(2)} mins` : 'N/A'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-xs">Driver</p>
                                    <p className="text-gray-900 font-semibold text-xs">
                                        {pathData.driverName || 'Not Assigned'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-xs">Number of Orders</p>
                                    <p className="text-gray-900 font-semibold text-xs">{pathData.path.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-col md:flex-row gap-x-4 mt-2 gap-y-2 w-full h-[50vh] md:h-72 overflow-scroll items-center  text-xs">
                                {pathData.path.length === 0 ? (
                                    <div className="text-gray-500 text-center w-full py-4">
                                        No orders in this path
                                    </div>
                                ) : (
                                    pathData.path.map((order, index) => (
                                        <OrderCard orderId={order.id} index={index} />
                                ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        }

    </>
}


const OrderCard = ({ orderId, index }: { orderId: string, index: number }) => {
    const order = useRecoilValue(getOrder(orderId))
    return <>
        {order && (
            <div key={order.orderId || index} className="flex-shrink-0 w-64 border border-gray-300 rounded-md p-3 bg-gray-50 overflow-y-auto">
            <div className="flex flex-col gap-y-2">
                <div className="flex flex-row items-center justify-between">
                    <p className="text-blue-600 font-semibold text-sm">Order ID: {order.orderNumber || order.orderId || 'N/A'}</p>
                    <div className="flex items-center gap-x-2">
                        <p className="text-gray-600 font-medium text-sm">#{index + 1}</p>
                        <p className={`px-2 py-1 rounded text-xs font-medium ${order.priority === 'High' ? 'bg-red-100 text-red-700' :
                                order.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    order.priority === 'Special' ? 'bg-purple-100 text-purple-700' :
                                        'bg-green-100 text-green-700'
                            }`}>{order.priority}</p>
                    </div>
                </div>

                <div className="text-xs">
                    <p className="text-gray-700 mb-2">{order.cname}</p>
                </div>

                <div className="flex flex-col gap-y-1 text-xs">
                    <div className="flex items-start gap-x-1">
                        <FaLocationDot className="text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 line-clamp-2 text-left">{order.address}</p>
                    </div>

                    <div className="flex items-center gap-x-1">
                        <FaPhone className="text-blue-600 flex-shrink-0" />
                        <p className="text-gray-700 text-left">{order.cphone}</p>
                    </div>

                    {order.cemail && (
                        <div className="flex items-center gap-x-1">
                            <MdEmail className="text-blue-600 flex-shrink-0" />
                            <p className="text-gray-700 truncate text-left">{order.cemail}</p>
                        </div>
                    )}
                </div>
                {order.itemsDetail && (
                    <div className="mt-1">
                        <div className="flex items-start gap-x-1">
                            <FaBoxOpen className="text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-700 line-clamp-2 text-left">{order.itemsDetail}</p>
                        </div>
                    </div>
                )}

                {order.specialInstructions && (
                    <div className="mt-1">
                        <p className="text-blue-600 text-xs font-medium mb-1 text-left">Instructions:</p>
                        <p className="text-xs text-gray-700 line-clamp-2 text-left">{order.specialInstructions}</p>
                    </div>
                )}

                

                <div className="mt-auto pt-2">
                    <p className={`px-2 py-1 rounded text-xs font-medium text-center ${order.currentStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.currentStatus === 'OnTheWay' ? 'bg-blue-100 text-blue-700' :
                                order.currentStatus === 'Accepted' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                        }`}>{order.currentStatus}</p>
                </div>
            </div>
        </div>)}
    </>
}