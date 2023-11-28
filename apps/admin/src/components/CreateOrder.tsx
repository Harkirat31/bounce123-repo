import { useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
//import { getSideItems } from "../store/selectors/sideItemsSelector"
import { ErrorCode, order } from "types/src/index"
//import { TiDelete } from "react-icons/ti"
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
//import { getRentingItems } from "../store/selectors/rentingItemsSelector"
import UploadOrdersCSV from "./UploadOrdersCSV"
import { createOrder, getOrdersAPI } from "../services/ApiService"
import { ordersAtom, ordersSearchDate } from "../store/atoms/orderAtom"


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
    //const [sideItems, setSideItems] = useState<{ sideItemId: string, sideItemTitle: string, count: number, }[]>([])
    // const sideItemsFromDb: any = useRecoilValue(getSideItems)
    // const [dropDownItem, setDropDownItem] = useState<{ sideItemId: string, sideItemTitle: string, count: number, }>({ sideItemId: '', sideItemTitle: 'Select', count: 1 })
    // const rentingItemsFromDB: any = useRecoilValue(getRentingItems)
    // const [dropDownRentingItem, setDropDownRentingItem] = useState<{ rentingItemId: string, rentingItemTitle: string }>({ rentingItemId: '', rentingItemTitle: 'Select' })
    // const selectRef = useRef<HTMLSelectElement | null>(null);
    // const selectRefExtras = useRef<HTMLSelectElement | null>(null);
    //const [rentingItems, setRentingItems] = useState<{ rentingItemId: string, rentingItemTitle: string, }[]>([])
    const [priority, setPriority] = useState("Medium")
    const setOrders = useSetRecoilState(ordersAtom)
    const [errorMessage, setErrorMessage] = useState<any[]>([])

    function saveOrder() {

        //let parsedOrder = order.safeParse({ cname: cName, cphone, address, deliveryDate: new Date(date!.setHours(0, 0, 0, 0)), extraItems: sideItems, rentingItems, priority, specialInstructions })
        setErrorMessage([])
        let parsedOrder: any = {}
        if (cemail == "") {
            parsedOrder = validateInput({ cname: cName, orderNumber: orderNumber, cphone, address, deliveryDate: new Date(date!.setHours(0, 0, 0, 0)), priority, specialInstructions, itemsDetail })
        }
        else {
            parsedOrder = validateInput({ cname: cName, orderNumber: orderNumber, cphone, cemail, address, deliveryDate: new Date(date!.setHours(0, 0, 0, 0)), priority, specialInstructions, itemsDetail })
        }


        if (parsedOrder == null) {
            return
        }
        createOrder(parsedOrder).then((result: any) => {
            if (date) {
                getOrdersAPI(date).then((orders: any) => {
                    resetInputs()
                    setOrders(orders)
                    setSearchDate(date)

                })
            }
            if (result.err != null || result.err != undefined) {
                if (result.err == ErrorCode.WrongInputs) {
                    setErrorMessage(["Wrong Inputs"])
                }
                if (result.err == ErrorCode.AddressError) {
                    setErrorMessage(["Address is not valid, Not Recognised by Google Maps"])
                }
            }
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


    // const handleRentingItemBoxDelete = (event: any) => {
    //     const button = event.currentTarget;
    //     const rentingItemId = button.getAttribute('data-value');
    //     let isdeleted = false
    //     let updatedItems = rentingItems.filter((item) => {
    //         if (item.rentingItemId === rentingItemId && isdeleted === false) {
    //             isdeleted = true
    //             return false
    //         }
    //         return true
    //     })
    //     setRentingItems(updatedItems)
    // }

    // const handleSideItemBoxDelete = (event: any) => {
    //     const button = event.currentTarget;
    //     const sideItemId = button.getAttribute('data-value');
    //     let updatedSideItems = sideItems.filter((sideItem) => {
    //         return sideItem.sideItemId != sideItemId
    //     })
    //     setSideItems(updatedSideItems)
    // }


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

                {/* <div className="mb-2 flex flex-row">
                    <div className="flex ">
                        <p className="flex text-blue-900 items-center">Main Item:</p>
                        <select ref={selectRef} value={dropDownRentingItem.rentingItemId} onChange={(event) => { setDropDownRentingItem({ rentingItemId: event.target.value, rentingItemTitle: selectRef.current!.options[selectRef.current!.selectedIndex].text, }) }} className="ml-2  border-2 border-blue-900" >
                            <option value={""}>Select</option>
                            {rentingItemsFromDB.map((rentingItem: RentingItemType) => {
                                return <>
                                    <option value={rentingItem.rentingItemId}>{rentingItem.title}</option>
                                </>
                            })}
                        </select>
                    </div>

                    <div>
                        <button type="button" onClick={() => {
                            if (dropDownRentingItem.rentingItemId == "") {
                                return
                            }
                            setRentingItems([{ rentingItemId: dropDownRentingItem.rentingItemId, rentingItemTitle: dropDownRentingItem.rentingItemTitle }, ...rentingItems])
                        }} className="ml-2 p-0.5 px-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center mr-3 md:mr-0">Add</button>
                    </div>
                </div>

                {rentingItems.length > 0 && <div className="grid grid-cols-3">
                    {rentingItems.map((rentingItem) => {
                        return <div className="relative">
                            <button data-value={rentingItem.rentingItemId} onClick={handleRentingItemBoxDelete} className=" hover:text-blue-700 cursor-pointer absolute right-0 top-0 text-lg" ><TiDelete></TiDelete></button>
                            <p className="mx-1 my-1 p-2 bg-blue-100 text-center rounded-lg">{rentingItem.rentingItemTitle}</p>
                        </div>
                    })}
                </div>}



                {sideItems.length > 0 && <div className="grid grid-cols-3">
                    {sideItems.map((sideItem) => {
                        return <div>
                            <h4 className="text-blue-900">Extras</h4>
                            <div className="relative">
                                <button data-value={sideItem.sideItemId} onClick={handleSideItemBoxDelete} className=" hover:text-blue-700 cursor-pointer absolute right-0 top-0 text-lg" ><TiDelete></TiDelete></button>
                                <p className="mx-1 my-1 p-2 bg-blue-100 text-center rounded-lg">{sideItem.count + "-" + sideItem.sideItemTitle}</p>
                            </div>
                        </div>
                    })}
                </div>}

                <div className="flex flex-row">
                    <div className="flex ">
                        <p className="flex items-center text-blue-900">Extras:</p>
                        <select ref={selectRefExtras} value={dropDownItem.sideItemId} onChange={(event) => { setDropDownItem({ sideItemId: event.target.value, sideItemTitle: selectRefExtras.current!.options[selectRefExtras.current!.selectedIndex].text, count: 1 }) }} className="ml-2  border-2 border-blue-900" >
                            <option value={""}>Select</option>
                            {sideItemsFromDb.map((sideItem: SideItemType) => {
                                return <>
                                    <option value={sideItem.sideItemId}>{sideItem.title}</option>
                                </>
                            })}
                        </select>
                    </div>
                    <div className="ml-2 flex ">
                        <p className="flex items-center text-blue-900">Count:</p>
                        <select value={dropDownItem.count} onChange={(event) => { setDropDownItem({ sideItemId: dropDownItem.sideItemId, sideItemTitle: dropDownItem.sideItemTitle, count: parseInt(event.target.value) }) }} className="ml-2  border-2 border-blue-900" >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                        </select>
                    </div>
                    <div>
                        <button type="button" onClick={() => {
                            if (dropDownItem.sideItemId == "") {
                                return
                            }
                            let updatedSideItems = sideItems.filter((element) => {
                                if (element.sideItemId != dropDownItem.sideItemId) {
                                    return element
                                }
                            })

                            setSideItems([{ sideItemId: dropDownItem.sideItemId, count: dropDownItem.count, sideItemTitle: dropDownItem.sideItemTitle }, ...updatedSideItems])
                        }} className="ml-2 p-0.5 px-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center mr-3 md:mr-0">Add</button>
                    </div>
                </div> */}


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