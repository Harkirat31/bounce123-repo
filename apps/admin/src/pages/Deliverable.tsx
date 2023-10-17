import { useState } from "react"

import RentingItemsTable from "../components/RentingItemsTable.tsx";
import CreateRentingItem from "../components/CreateRentingItem.tsx";
import CreateSideItem from "../components/CreateSideItem.tsx";
import SideItemsTable from "../components/SideItemsTable.tsx";



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
              <CreateSideItem></CreateSideItem>
            </div>
          }
        </div>
        <div></div>


      </div>
    </>
  )
}

export default Deliverable


