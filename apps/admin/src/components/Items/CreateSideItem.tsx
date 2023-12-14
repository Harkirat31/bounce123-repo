import { useState } from "react"

import { sideItem } from "types/src/index"
import { BASE_URL } from "../../../config"


const CreateSideItem = () => {
    const [title, setTitle] = useState("")
    const [capacity, setCapacity] = useState(0)


    function saveSideItem() {

        let parsedSideItem = sideItem.safeParse({ title, capacity })

        if (!parsedSideItem.success) {
            alert("Error in Data")
            return
        }


        fetch(BASE_URL + '/admin/createSideItem', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsedSideItem.data)
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


    return <>
        <div className="mr-4 justify-center">
            <p className="text-blue-900 text-center" >Create New Side Item</p>
            <div className="mt-4">
                <input onChange={(event) => setTitle(event.target.value)} placeholder="Title" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <input onChange={(event) => { setIntParam(event, setCapacity) }} placeholder="Capacity" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <button onClick={saveSideItem} type="button" className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0">Submit</button>

            </div>
        </div>
    </>
}

export default CreateSideItem