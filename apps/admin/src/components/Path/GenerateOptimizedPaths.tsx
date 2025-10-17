import { useRecoilValue, useSetRecoilState } from "recoil"
import { loadingState } from "../../store/atoms/loadingStateAtom"
import { ordersSearchDate } from "../../store/atoms/orderAtom"
import { convertToUTC } from "../../utils/UTCdate"
import { userAtom } from "../../store/atoms/userAtom"
import { getOrdersForGeneratingOptimizedPaths } from "../../store/atoms/pathAtom"
import { generateOptomizePathsAPI } from "../../services/ApiService"
import { refreshData } from "../../store/atoms/refreshAtom"
import { useRef, useState } from "react"
import { FaExternalLinkAlt, FaRoute, FaTimes } from "react-icons/fa";
import { MdAutoMode, MdNumbers } from "react-icons/md";


export const GenerateOptimizedPaths = () => {
    const setLoading = useSetRecoilState(loadingState)
    const date = useRecoilValue(ordersSearchDate)
    const user = useRecoilValue(userAtom)
    const orders = useRecoilValue(getOrdersForGeneratingOptimizedPaths)
    const refreshAllData = useSetRecoilState(refreshData)

    const [numberOfPaths, setNumberOfPaths] = useState<number>();
    const [isOpen, setIsOpen] = useState(false)
    const divRef = useRef<HTMLDivElement | null>(null);
    const [errorMessage, setErrorMessage] = useState("")



    const clickButton = () => {
        setIsOpen(true)
    }

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrorMessage("")
        if (!numberOfPaths) {
            setErrorMessage("Number of Paths should be greater than 0")
            return
        }
        if (numberOfPaths > orders.length) {
            setErrorMessage(`Number of paths cannot exceed the number of available deliveries (${orders.length})`)
            return
        }
        const divElement = divRef.current;
        let totalPendingDeliveries = 0
        let newDate = convertToUTC(date)
        const startingLocation = user?.location ?? { lat: 0, lng: 0 }
        const orderIdsWithLocation = orders.map(
            order => ({ id: order.orderId!, latlng: order.location! })
        )
        if (divElement == null) {
            return
        }
        // Retrieve input elements inside the div
        const inputElements = divElement.querySelectorAll("input");


        const capacityArray: number[] = []
        Array.from(inputElements).forEach((input) => {
            totalPendingDeliveries = totalPendingDeliveries + Number.parseInt(input.value)
            capacityArray.push(Number.parseInt(input.value))
        });

        const demands = orders.map((e) => 1)
        demands.unshift(0)

        if (capacityArray.length > 0 && numberOfPaths && numberOfPaths > 0 && demands.length > 1) {
            setLoading({ isLoading: true, value: "Generating Routes. Please Wait...." })
            generateOptomizePathsAPI({ date: newDate, orderIdsWithLocation: orderIdsWithLocation, startingLocation: startingLocation, numberOfVehicles: numberOfPaths, demands, vehicleCapacity: capacityArray }).then((result: any) => {
                if (result.isCreated) {
                    refreshAllData(Date.now().toString())
                }
                else {
                    setLoading({ isLoading: false, value: null })

                    if (result.msg) {
                        setErrorMessage(result.msg)
                    }
                    alert("Please try again later")
                    setIsOpen(false)
                }
                setLoading({ isLoading: false, value: null })
            }).catch((error) => {
                alert(error)
           //     setLoading({ isLoading: false, value: null })
           //     setIsOpen(false)
            })
        }

    }

    return (
        <div className="relative mt-1 w-full">
            {/* Trigger Button */}
            <button 
                className="w-full p-2 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex items-center justify-center space-x-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium" 
                onClick={clickButton}
            >
                <MdAutoMode className="w-4 h-4" />
                <span>Generate Optimized Routes</span>
                <FaExternalLinkAlt className="w-3 h-3" />
            </button>

            {/* Modal Overlay */}
            <div className={`fixed inset-0 transition-all duration-300 z-[60] ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"></div>
                
                {/* Modal Content */}
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div className={`relative w-full max-w-md bg-white rounded-xl shadow-2xl transition-all duration-300 ${isOpen ? "scale-100" : "scale-95"}`}>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <FaRoute className="w-5 h-5" />
                                <h2 className="text-lg font-semibold">Auto Route Generation</h2>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-blue-800 rounded-lg transition-colors"
                            >
                                <FaTimes className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={submitForm} className="p-6">
                            <div className="space-y-4">
                                {/* Number of Paths Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <MdNumbers className="w-4 h-4 mr-2 text-blue-600" />
                                        Number of Paths to Create
                                    </label>
                                    <input 
                                        required 
                                        value={numberOfPaths} 
                                        onChange={(e) => {
                                            const value = Number.parseInt(e.target.value);
                                            setNumberOfPaths(value);
                                            // Clear error if input is valid
                                            if (value && value <= orders.length) {
                                                setErrorMessage("");
                                            }
                                        }} 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                                        type="number"
                                        min="1"
                                        max={orders.length}
                                        placeholder={`Enter number of paths (max: ${orders.length})`}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Maximum {orders.length} paths allowed (one per delivery)
                                    </p>
                                </div>

                                {/* Capacity Inputs */}
                                {numberOfPaths != undefined && numberOfPaths > 0 && numberOfPaths <= orders.length && (
                                    <div ref={divRef} className="space-y-3">
                                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                            <p className="text-sm text-blue-800 font-medium mb-2">
                                                📦 Pending Deliveries: {orders.length}
                                            </p>
                                            <p className="text-xs text-blue-700">
                                                Assign deliveries to each path below
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Deliveries per Path
                                            </label>
                                            <div className="max-h-48 overflow-y-auto pr-2">
                                                <div className="grid grid-cols-2 gap-2">
                                                    {Array.from({ length: numberOfPaths }).map((_, index) => (
                                                        <div key={index} className="relative">
                                                            <input 
                                                                required 
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center" 
                                                                type="number"
                                                                min="1"
                                                                placeholder={`Path ${index + 1}`}
                                                            />
                                                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Warning for invalid path count */}
                                {numberOfPaths != undefined && numberOfPaths > orders.length && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                        <p className="text-yellow-700 text-sm font-medium">
                                            ⚠️ Number of paths ({numberOfPaths}) exceeds available deliveries ({orders.length})
                                        </p>
                                        <p className="text-yellow-600 text-xs mt-1">
                                            Please reduce the number of paths to continue
                                        </p>
                                    </div>
                                )}

                                {/* Error Message */}
                                {errorMessage.length > 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <p className="text-red-700 text-sm font-medium">
                                            ⚠️ Error: {errorMessage}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3 mt-6">
                                <button 
                                    type="submit" 
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                                >
                                    <MdAutoMode className="w-4 h-4" />
                                    <span>Generate Routes</span>
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsOpen(false)} 
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}