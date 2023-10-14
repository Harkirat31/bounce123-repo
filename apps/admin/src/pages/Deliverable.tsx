import { useState } from "react"
import { useRecoilValue } from "recoil"
import { getRentingItems } from "../store/selectors/rentingItemsSelector"



const Deliverable = () => {
  const [whichItem, setWhichItem] = useState(0)
  return (
    <>
      <div className="md:grid md:grid-cols-12 md:ml-10">
        <div className="md:col-span-9">
          <div className="flex items-start flex-col p-4">

            <div className="flex">
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
        <div className="md:col-span-3 ">
          {whichItem == 0 &&
            <div>
              Renting Item
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
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
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
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {(rentingItems as []).map((item) => {
              return <>
                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Magic Mouse 2
                  </th>
                  <td className="px-6 py-4">
                    Black
                  </td>
                  <td className="px-6 py-4">
                    Accessories
                  </td>
                  <td className="px-6 py-4">
                    $99
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

const SideItemsTable = () => {
  return <>
    Side Item
  </>
}