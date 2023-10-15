import { useState } from "react"
import { useRecoilValue } from "recoil"
import { getRentingItems } from "../store/selectors/rentingItemsSelector"
import { RentingItemType, SideItemType } from "types"



const Deliverable = () => {
  const [whichItem, setWhichItem] = useState(0)
  return (
    <>
      <div className="mt-4 pt-4 lg:grid md:grid-cols-12 md:ml-10">
        <div className="md:col-span-8">
          <div className="flex items-center flex-col">

            <div className="flex ">
              <p className="text-blue-900">Select Item Type :</p>
              <select className="ml-2  border-2 border-blue-900" onChange={(event) => { setWhichItem(parseInt(event.target.value)) }}>
                <option value={0}>Renting Items</option>
                <option value={1}>Side Item</option>
              </select>
            </div>

            {whichItem == 0 &&
              <div>
                <RentingItemsTable></RentingItemsTable>
              </div>
            }
            {whichItem == 1 &&
              <div>
                <SideItemsTable></SideItemsTable>
              </div>
            }
          </div>
        </div>
        <div className="md:col-span-4 ">
          {whichItem == 0 &&
            <div>
              <CreateRentingItem></CreateRentingItem>
            </div>
          }
          {whichItem == 1 &&
            <div>
              Side Item
            </div>
          }
        </div>
        <div></div>


      </div>
    </>
  )
}

export default Deliverable


const RentingItemsTable = () => {

  // let items: number[] = [1, 2, 3];
  const rentingItems = useRecoilValue(getRentingItems)
  if (rentingItems != null && (rentingItems as []).length > 0) {
    return <>
      <div className="mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product title
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Capacity
              </th>
              <th scope="col" className="px-6 py-3">
                Delivery Price
              </th>
              <th scope="col" className="px-6 py-3">
                Side Items
              </th>

              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {(rentingItems as []).map((item: RentingItemType) => {
              return <>
                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {item.title}
                  </th>
                  <td className="px-6 py-4">
                    {item.category}
                  </td>
                  <td className="px-6 py-4">
                    {item.capacity}
                  </td>
                  <td className="px-6 py-4">
                    {item.deliveryPrice}
                  </td>
                  <td className="px-6 py-4">
                    {item.sideItems.map((sideItem) => {
                      return <>{
                        <p>{sideItem.count + " " + sideItem.sideItemTitle}</p>
                      }</>
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                  </td>
                </tr>
              </>
            })}
          </tbody>
        </table>
      </div>

    </>

  }
  else {
    return <div className="mt-10 w-full bg-slate-50 shadow-md">
      <p className="p-10">No Renting Item is created</p>
    </div>
  }

}

const CreateRentingItem = () => {

  const [sideItems, setSideItems] = useState<{ sideItemId: string, sideItemTitle: string, count: number, }[]>([])
  return <>
    <div className="mr-4 justify-center">
      <p className="text-blue-900 text-center" >Create New Renting</p>
      <div className="mt-4">
        <input placeholder="Title" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
        <input placeholder="Category" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
        <input placeholder="Capacity" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
        <input placeholder="Delivery Price" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
        {sideItems.length > 0 && <div className="grid grid-cols-3">
          {sideItems.map((sideItem) => {
            return <div className="relative">
              <p className=" hover:text-blue-700 cursor-pointer absolute right-1 -top-2 text-lg" >x</p>
              <p className="mx-1 my-1 p-2 bg-blue-100 text-center rounded-lg">{sideItem.count + "-" + sideItem.sideItemTitle}</p>
            </div>
          })}
        </div>}
        <div className="flex flex-row">
          <div className="flex ">
            <p className="text-blue-900">Side Item:</p>
            <select className="ml-2  border-2 border-blue-900" >
              <option value={0}>Blower</option>
              <option value={1}>Tarp</option>
            </select>
          </div>
          <div className="ml-2 flex ">
            <p className="text-blue-900">Count:</p>
            <select className="ml-2  border-2 border-blue-900" >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>
          <div>
            <button type="button" onClick={() => {
              setSideItems([{ sideItemId: "id", count: 2, sideItemTitle: "Blower" }, ...sideItems])
            }} className="ml-2 p-0.5 px-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center mr-3 md:mr-0">Add</button>
          </div>
        </div>

        <button type="button" className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0">Submit</button>

      </div>
    </div>
  </>
}

const SideItemsTable = () => {
  return <>
    Side Item
  </>
}