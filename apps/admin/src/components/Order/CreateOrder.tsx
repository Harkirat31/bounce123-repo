import { useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
//import { getSideItems } from "../store/selectors/sideItemsSelector"
import { ErrorCode, order } from "types/src/index"
//import { TiDelete } from "react-icons/ti"
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
//import { getRentingItems } from "../store/selectors/rentingItemsSelector"
import UploadOrdersCSV from "./UploadOrdersCSV"
import { createOrder } from "../../services/ApiService"
import { ordersSearchDate } from "../../store/atoms/orderAtom"
import { convertToUTC } from "../../utils/UTCdate";
import { loadingState } from "../../store/atoms/loadingStateAtom";


const CreateOrder = () => {
    const [cName, setCName] = useState("")
    const [cphone, setCPhone] = useState("")
    const [address, setAddress] = useState("")
    const [orderNumber, setOrderNumber] = useState("")
    const [cemail, setCEmail] = useState<string>("")
    const [_searchDate, setSearchDate] = useRecoilState(ordersSearchDate)
    const [date, setDate] = useState<Date | null>(_searchDate)
    const [specialInstructions, setSpecialInstructions] = useState("")
    const [itemsDetail, setItemsDetail] = useState("")
    const [priority, setPriority] = useState("Medium")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [generalErrors, setGeneralErrors] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const setLoading = useSetRecoilState(loadingState)


    function saveOrder() {
        setFieldErrors({})
        setGeneralErrors([])
        let parsedOrder: any = {}
        if (date == null) {
            setFieldErrors((prev) => ({ ...prev, deliveryDate: "Delivery date is required" }))
            return
        }
        let newDate = convertToUTC(date)

        const payloadBase = { cname: cName, orderNumber: orderNumber, cphone, address, deliveryDate: newDate, priority, specialInstructions, itemsDetail }
        parsedOrder = cemail === "" ? validateInput(payloadBase) : validateInput({ ...payloadBase, cemail })

        if (parsedOrder == null) {
            return
        }
        setIsSubmitting(true)
        setLoading({ isLoading: true, value: "Creating order. Please Wait..." })
        createOrder(parsedOrder).then((result: any) => {
            if (date) {
                resetInputs()
                setSearchDate(new Date(date)) // setting date will trigger useEffect in Init component
            }
            if (result.err != null || result.err != undefined) {
                if (result.err == ErrorCode.WrongInputs) {
                    setGeneralErrors(["Wrong Inputs"])
                }
                if (result.err == ErrorCode.AddressError) {
                    setGeneralErrors(["Address is not valid, Not Recognised by Google Maps"])
                }
                if (result.err == ErrorCode.OrderLimitIncrease) {
                    setGeneralErrors(["Order Maximum Limit reached, Please contact info@easeyourtasks.com"])
                }
            }
        }).catch(() => {
            setGeneralErrors(["Something went wrong. Please try again."])
        }).finally(() => {
            setLoading({ isLoading: false, value: null })
            setIsSubmitting(false)
        })
    }

    const resetInputs = () => {
        setCName("")
        setAddress("")
        setCEmail("")
        setCPhone("")
        setOrderNumber("")
        setSpecialInstructions("")
        setItemsDetail("")
    }

    const validateInput = (input: {}) => {
        const parsedInput = order.safeParse(input)
        if (parsedInput.success) {
            // Extra phone validation (friendly message)
            const onlyDigits = (parsedInput.data.cphone || '').replace(/\D/g, '')
            if (onlyDigits.length < 10) {
                setFieldErrors((prev) => ({ ...prev, cphone: "Please enter a 10-digit phone number" }))
                return null
            }
            return parsedInput.data
        } else {
            const errors: Record<string, string> = {}
            parsedInput.error.issues.forEach((issue) => {
                const key = String(issue.path[0])
                errors[key] = mapFriendlyError(key, issue.message)
            })
            setFieldErrors(errors)
            return null
        }
    }

    const mapFriendlyError = (field: string, rawMessage: string): string => {
        switch (field) {
            case 'cname':
                return 'Name is required'
            case 'address':
                return 'Address is required'
            case 'cphone':
                return 'Phone is required'
            case 'cemail':
                return 'Please enter a valid email address'
            case 'deliveryDate':
                return 'Delivery date is required'
            case 'priority':
                return 'Please select a priority'
            case 'itemsDetail':
                return 'Please provide item details'
            default:
                // Fallback to a readable version of zod message
                return rawMessage.charAt(0).toUpperCase() + rawMessage.slice(1)
        }
    }


    return <>
        <div className="mr-2 justify-center">
            <UploadOrdersCSV />
            <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900">Create Order</h3>
                <p className="mt-0.5 text-xs text-gray-500">Enter customer and delivery details.</p>

                {generalErrors.length > 0 && (
                    <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                        {generalErrors.map((e, i) => (
                            <div key={i}>{e}</div>
                        ))}
                    </div>
                )}

                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {/* helper for consistent input/textarea styles */}
                    {/* eslint-disable-next-line */}
                    {false && <></>}
                    
                    
                    <div>
                        <label className="block text-xs text-gray-700 mb-0.5">Order # (optional)</label>
                        <input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="e.g., 1024" type="text" className={`block w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 border ${fieldErrors.orderNumber ? 'border-red-500 bg-red-50 focus:ring-red-400' : `${orderNumber.trim()==='' ? 'bg-gray-50' : 'bg-white'} border-gray-300 focus:ring-blue-500`}`} />
                        {fieldErrors.orderNumber && <p className="mt-0.5 text-xs text-red-600">{fieldErrors.orderNumber}</p>}
                    </div>
                    <div>
                        <label className="block text-xs text-gray-700 mb-0.5">Name</label>
                        <input value={cName} onChange={(e) => setCName(e.target.value)} placeholder="Customer name" type="text" className={`block w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 border ${fieldErrors.cname ? 'border-red-500 bg-red-50 focus:ring-red-400' : `${cName.trim()==='' ? 'bg-gray-50' : 'bg-white'} border-gray-300 focus:ring-blue-500`}`} />
                        {fieldErrors.cname && <p className="mt-0.5 text-xs text-red-600">{fieldErrors.cname}</p>}
                    </div>
                    <div>
                        <label className="block text-xs text-gray-700 mb-0.5">Phone</label>
                        <input value={cphone} onChange={(e) => setCPhone(e.target.value)} inputMode="tel" placeholder="10-digit phone" type="text" className={`block w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 border ${fieldErrors.cphone ? 'border-red-500 bg-red-50 focus:ring-red-400' : `${cphone.trim()==='' ? 'bg-gray-50' : 'bg-white'} border-gray-300 focus:ring-blue-500`}`} />
                        {fieldErrors.cphone && <p className="mt-0.5 text-xs text-red-600">{fieldErrors.cphone}</p>}
                    </div>
                    <div>
                        <label className="block text-xs text-gray-700 mb-0.5">Email (optional)</label>
                        <input value={cemail} onChange={(e) => setCEmail(e.target.value)} placeholder="name@example.com" type="email" className={`block w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 border ${fieldErrors.cemail ? 'border-red-500 bg-red-50 focus:ring-red-400' : `${cemail.trim()==='' ? 'bg-gray-50' : 'bg-white'} border-gray-300 focus:ring-blue-500`}`} />
                        {fieldErrors.cemail && <p className="mt-0.5 text-xs text-red-600">{fieldErrors.cemail}</p>}
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs text-gray-700 mb-0.5">Address</label>
                        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, City" type="text" className={`block w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 border ${fieldErrors.address ? 'border-red-500 bg-red-50 focus:ring-red-400' : `${address.trim()==='' ? 'bg-gray-50' : 'bg-white'} border-gray-300 focus:ring-blue-500`}`} />
                        {fieldErrors.address && <p className="mt-0.5 text-xs text-red-600">{fieldErrors.address}</p>}
                    </div>
                    <div>
                        <label className="block text-xs text-gray-700 mb-0.5">Delivery Date</label>
                        <DatePicker className={`w-full rounded-md px-3 py-2 text-sm border ${fieldErrors.deliveryDate ? 'border-red-500 bg-red-50 focus:ring-red-400' : `${!date ? 'bg-gray-50' : 'bg-white'} border-gray-300 focus:ring-blue-500`}`} showIcon selected={date} onChange={(date1) => setDate(date1)} />
                        {fieldErrors.deliveryDate && <p className="mt-0.5 text-xs text-red-600">{fieldErrors.deliveryDate}</p>}
                    </div>
                    <div>
                        <label className="block text-xs text-gray-700 mb-0.5">Priority</label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value={"High"}>High</option>
                            <option value={"Medium"}>Medium</option>
                            <option value={"Low"}>Low</option>
                            <option value={"Special"}>Special</option>
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs text-gray-700 mb-0.5">Items Detail</label>
                        <textarea value={itemsDetail} onChange={(e) => setItemsDetail(e.target.value)} className={`block w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 border ${fieldErrors.itemsDetail ? 'border-red-500 bg-red-50 focus:ring-red-400' : `${itemsDetail.trim()==='' ? 'bg-gray-50' : 'bg-white'} border-gray-300 focus:ring-blue-500`}`} placeholder="Item Details" rows={2} />
                        {fieldErrors.itemsDetail && <p className="mt-0.5 text-xs text-red-600">{fieldErrors.itemsDetail}</p>}
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs text-gray-700 mb-0.5">Special Instructions</label>
                        <textarea value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} className={`block w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 border ${fieldErrors.specialInstructions ? 'border-red-500 bg-red-50 focus:ring-red-400' : `${specialInstructions.trim()==='' ? 'bg-gray-50' : 'bg-white'} border-gray-300 focus:ring-blue-500`}`} placeholder="Special Instructions" rows={2} />
                        {fieldErrors.specialInstructions && <p className="mt-0.5 text-xs text-red-600">{fieldErrors.specialInstructions}</p>}
                    </div>
                </div>

                <button onClick={saveOrder} type="button" disabled={isSubmitting} className="mt-2 w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </div>
    </>
}

export default CreateOrder