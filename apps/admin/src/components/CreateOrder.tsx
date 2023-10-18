import { useRef, useState } from "react"
import { useRecoilValue } from "recoil"
import { getSideItems } from "../store/selectors/sideItemsSelector"
import { SideItemType, rentingItem } from "types/src/index"
import { BASE_URL } from "../../config"
import { TiDelete } from "react-icons/ti"
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import { getRentingItems } from "../store/selectors/rentingItemsSelector"


const CreateDriver = () => {
    const [cName, setCName] = useState("")
    const [cphone, setCPhone] = useState("")
    const [address, setAddress] = useState("")
    const [date, setDate] = useState<Date | null>(new Date())

    const rentingItemsFromDB: any = useRecoilValue(getRentingItems)
    const [rentingItems, setRentingItems] = useState<{ rentingItemId: string, rentingItemTitle: string, }[]>([])
    const [time, setTime] = useState(2)
    const [dropDownRentingItem, setDropDownRentingItem] = useState<{ rentingItemId: string, rentingItemTitle: string }>({ rentingItemId: '', rentingItemTitle: 'Select' })

    const selectRef = useRef<HTMLSelectElement | null>(null);

    function saveOrder() {


    }
    const setIntParam = (event: any, stateVariable: any) => {
        let capacity = 0
        try {
            capacity = parseInt(event.target.value)
        }
        catch (error) {

        }
        stateVariable(capacity)
    }

    const handleRentingItemBoxDelete = (event: any) => {
        const button = event.currentTarget;
        const rentingItemId = button.getAttribute('data-value');
        let isdeleted = false
        let updatedItems = rentingItems.filter((item) => {
            if (item.rentingItemId === rentingItemId && isdeleted === false) {
                isdeleted = true
                return false
            }
            return true
        })
        setRentingItems(updatedItems)
    }

    return <>
        <div className="mr-4 justify-center">
            <p className="text-blue-900 text-center" >Create New Order</p>
            <div className="mt-4">
                <input onChange={(event) => setCName(event.target.value)} placeholder="Name" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <input onChange={(event) => setCPhone(event.target.value)} placeholder="Phone" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <input onChange={(event) => setAddress(event.target.value)} placeholder="Address" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <div className="flex mb-2">
                    <DatePicker className="block text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500" showIcon selected={date} onChange={(date) => setDate(date)} />
                    <p className="ml-2 text-blue-900">Time:</p>
                    <select value={time} onChange={(event) => setTime(parseInt(event.target.value))} className="border-2 border-blue-900" >
                        <option value={1}>Before 10AM</option>
                        <option value={2}>Between 10AM-12PM</option>
                        <option value={3}>After 12PM</option>
                    </select>


                </div>

                {rentingItems.length > 0 && <div className="grid grid-cols-3">
                    {rentingItems.map((rentingItem) => {
                        return <div className="relative">
                            <button data-value={rentingItem.rentingItemId} onClick={handleRentingItemBoxDelete} className=" hover:text-blue-700 cursor-pointer absolute right-0 top-0 text-lg" ><TiDelete></TiDelete></button>
                            <p className="mx-1 my-1 p-2 bg-blue-100 text-center rounded-lg">{rentingItem.rentingItemTitle}</p>
                        </div>
                    })}
                </div>}

                <div className="mb-2 flex flex-row">
                    <div className="flex ">
                        <p className="text-blue-900">Renting Item:</p>
                        <select ref={selectRef} value={dropDownRentingItem.rentingItemId} onChange={(event) => { setDropDownRentingItem({ rentingItemId: event.target.value, rentingItemTitle: selectRef.current!.options[selectRef.current!.selectedIndex].text, }) }} className="ml-2  border-2 border-blue-900" >
                            <option value={""}>Select</option>
                            {rentingItemsFromDB.map((sideItem: SideItemType) => {
                                return <>
                                    <option value={sideItem.sideItemId}>{sideItem.title}</option>
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

                <textarea className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500" placeholder="Special Instructions" rows={3} />


                <button onClick={saveOrder} type="button" className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0">Submit</button>

            </div>
        </div >
    </>
}

export default CreateDriver