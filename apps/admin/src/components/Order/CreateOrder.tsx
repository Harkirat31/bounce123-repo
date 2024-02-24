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
    const [errorMessage, setErrorMessage] = useState<any[]>([])
    const setLoading = useSetRecoilState(loadingState)


    function saveOrder() {

        setErrorMessage([])
        let parsedOrder: any = {}
        if (date == null) {
            return
        }
        let newDate = convertToUTC(date)

        if (cemail == "") {
            parsedOrder = validateInput({ cname: cName, orderNumber: orderNumber, cphone, address, deliveryDate: newDate, priority, specialInstructions, itemsDetail })
        }
        else {
            parsedOrder = validateInput({ cname: cName, orderNumber: orderNumber, cphone, cemail, address, deliveryDate: newDate, priority, specialInstructions, itemsDetail })
        }


        if (parsedOrder == null) {
            return
        }
        setLoading(true)
        createOrder(parsedOrder).then((result: any) => {
            if (date) {
                resetInputs()
                setSearchDate(new Date(date)) // setting date will triger useEffect in Init component
            }
            if (result.err != null || result.err != undefined) {
                if (result.err == ErrorCode.WrongInputs) {
                    setErrorMessage(["Wrong Inputs"])
                }
                if (result.err == ErrorCode.AddressError) {
                    setErrorMessage(["Address is not valid, Not Recognised by Google Maps"])
                }
            }
            setLoading(false)
        }).catch((error) => {
            setLoading(true)
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
        let parsedInput = order.safeParse(input)
        if (parsedInput.success) {
            try {
                let phone = parseInt(parsedInput.data.cphone)
                if (!phone) {
                    setErrorMessage(["Phone: Not Valid Phone number"])
                    return null
                }
            }
            catch {
                setErrorMessage(["Phone: Not Valid Phone number"])
                return null
            }
            return parsedInput.data
        }
        else {
            let errors: any[] = []
            parsedInput.error.issues.forEach((issue) => {
                if (issue.path[0] == "cname") {
                    errors.push("Name:  " + issue.message)
                }
                if (issue.path[0] == "address") {
                    errors.push("Address: " + issue.message)
                }
                if (issue.path[0] == "cphone") {
                    errors.push("Phone: " + issue.message)
                }
                if (issue.path[0] == "cemail") {
                    errors.push("Email: " + issue.message)
                }

                setErrorMessage(errors)
            })
            return null
        }
    }


    return <>
        <div className="mr-2 justify-center">
            <UploadOrdersCSV></UploadOrdersCSV>
            <p className="text-blue-900 mt-5 " >New Order</p>
            <div className="text-xs mt-4">
                <input value={orderNumber} onChange={(event) => setOrderNumber(event.target.value)} placeholder="Order Id" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <input value={cName} onChange={(event) => setCName(event.target.value)} placeholder="Name" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <input value={cphone} onChange={(event) => setCPhone(event.target.value)} placeholder="Phone" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <input value={cemail} onChange={(event) => setCEmail(event.target.value)} placeholder="Email" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Address" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <div className="flex grid-cols-8 mb-2">
                    <DatePicker className="col-span-2  text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500" showIcon selected={date} onChange={(date1) => setDate(date1)} />
                    <div className="col-span-6 flex flex-row">
                        <p className="ml-2 flex items-center">Priority :</p>
                        <select value={priority} onChange={(event) => setPriority(event.target.value)} className="border-2 border-blue-900" >
                            <option value={"High"}>High</option>
                            <option value={"Medium"}>Medium</option>
                            <option value={"Low"}>Low</option>
                        </select>
                    </div>


                </div>


                <textarea value={itemsDetail} onChange={(event) => setItemsDetail(event.target.value)} className="block w-full p-2 mt-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500" placeholder="Item Details" rows={3} />

                <textarea value={specialInstructions} onChange={(event) => setSpecialInstructions(event.target.value)} className="block w-full p-2 mt-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500" placeholder="Special Instructions" rows={3} />

                {errorMessage.length > 0 &&
                    errorMessage.map((error) => {
                        return <p className="text-red-600 text-xs mt-2">{error}</p>
                    })
                }

                <button onClick={saveOrder} type="button" className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0">Submit</button>

            </div>
        </div >
    </>
}

export default CreateOrder