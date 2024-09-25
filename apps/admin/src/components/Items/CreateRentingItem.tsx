import { useRef, useState } from "react"
import { useRecoilValue } from "recoil"
import { getSideItems } from "../../store/selectors/sideItemsSelector"
import { SideItemType, rentingItem } from "types/src/index"
//import { BASE_URL } from "../../../config"
import { TiDelete } from "react-icons/ti"
import UploadItemsCSV from "./UploadItemsCSV"

const BASE_URL = import.meta.env.VITE_BASE_URL

const CreateRentingItem = () => {
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [capacity, setCapacity] = useState(0)
    const [deliveryPrice, setDeliveryPrice] = useState(0)
    const sideItemsFromDb: any = useRecoilValue(getSideItems)
    const [sideItems, setSideItems] = useState<{ sideItemId: string, sideItemTitle: string, count: number, }[]>([])
    const [dropDownItem, setDropDownItem] = useState<{ sideItemId: string, sideItemTitle: string, count: number, }>({ sideItemId: '', sideItemTitle: 'Select', count: 1 })

    const selectRef = useRef<HTMLSelectElement | null>(null);

    function saveRentingItem() {

        let parsedRentingItem = rentingItem.safeParse({ title, category, capacity, deliveryPrice, sideItems })

        console.log({ title, category, capacity, deliveryPrice, sideItems })

        if (!parsedRentingItem.success) {
            console.log(parsedRentingItem.error)
            alert("Error in Data")
            return
        }

        console.log(parsedRentingItem.data)

        fetch(BASE_URL + '/admin/createRentingItem', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsedRentingItem.data)
        }).then((response) => response.json().then((jsonData) => {
            console.log(jsonData)
        }))
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

    const handleSideItemBoxDelete = (event: any) => {
        const button = event.currentTarget;
        const sideItemId = button.getAttribute('data-value');
        let updatedSideItems = sideItems.filter((sideItem) => {
            return sideItem.sideItemId != sideItemId
        })
        setSideItems(updatedSideItems)
    }

    return <>
        <div className="mr-4 justify-center">
            <UploadItemsCSV></UploadItemsCSV>
            <p className="text-blue-900 text-center" >Create New Main Item</p>
            <div className="mt-4">
                <input onChange={(event) => setTitle(event.target.value)} placeholder="Title" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <input onChange={(event) => setCategory(event.target.value)} placeholder="Category" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <input onChange={(event) => { setIntParam(event, setCapacity) }} placeholder="Capacity" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <input onChange={(event) => { setIntParam(event, setDeliveryPrice) }} placeholder="Delivery Price" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                {sideItems.length > 0 && <div className="grid grid-cols-3">
                    {sideItems.map((sideItem) => {
                        return <div className="relative">
                            <button data-value={sideItem.sideItemId} onClick={handleSideItemBoxDelete} className=" hover:text-blue-700 cursor-pointer absolute right-0 top-0 text-lg" ><TiDelete></TiDelete></button>
                            <p className="mx-1 my-1 p-2 bg-blue-100 text-center rounded-lg">{sideItem.count + "-" + sideItem.sideItemTitle}</p>
                        </div>
                    })}
                </div>}
                <div className="flex flex-row">
                    <div className="flex ">
                        <p className="text-blue-900">Side Item:</p>
                        <select ref={selectRef} value={dropDownItem.sideItemId} onChange={(event) => { setDropDownItem({ sideItemId: event.target.value, sideItemTitle: selectRef.current!.options[selectRef.current!.selectedIndex].text, count: 1 }) }} className="ml-2  border-2 border-blue-900" >
                            <option value={""}>Select</option>
                            {sideItemsFromDb.map((sideItem: SideItemType) => {
                                return <>
                                    <option value={sideItem.sideItemId}>{sideItem.title}</option>
                                </>
                            })}
                        </select>
                    </div>
                    <div className="ml-2 flex ">
                        <p className="text-blue-900">Count:</p>
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
                </div>

                <button onClick={saveRentingItem} type="button" className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0">Submit</button>

            </div>
        </div>
    </>
}

export default CreateRentingItem