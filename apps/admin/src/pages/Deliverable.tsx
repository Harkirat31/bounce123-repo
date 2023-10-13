import { useState } from "react"

const Deliverable = () => {
  const [whichItem, setWhichItem] = useState(0)
  return (
    <div className="flex items-center flex-col p-4">
      <div className="p-2 border-2 border-blue-900">
        <select onChange={(event) => { setWhichItem(parseInt(event.target.value)) }}>
          <option value={0}>Create Renting Item</option>
          <option value={1}>Create Side Item</option>
        </select>
      </div>
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
  )
}

export default Deliverable
