import { useState } from "react"

import { driver } from "types/src/index"
import { createDriver, getDriversAPI } from "../services/ApiService"
import { useSetRecoilState } from "recoil"
import { driversState } from "../store/atoms/driversAtom"

const CreateDriver = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [vehicleCapacity, setVehicleCapacity] = useState(0)
    const [phone, setPhone] = useState("")
    const [vehicleStyle, setVehicleStyle] = useState("Pick Up")
    const setDrivers = useSetRecoilState(driversState)

    function saveDriver() {

        let parsedDriverData = driver.safeParse({ name, email, vehicleCapacity, vehicleStyle, phone })

        if (!parsedDriverData.success) {
            console.log(parsedDriverData.error)
            alert("Error in Data")
            return
        }
        createDriver(parsedDriverData.data).then((result: any) => {
            if (result.isAdded) {
                getDriversAPI().then((drivers: any) => {
                    setDrivers({
                        isLoading: false,
                        value: drivers
                    })
                })
            }
        }).catch((result) => {
            alert("Not Added, Errors in Detail or Internet is down")
        })
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
            <p className="text-blue-900 text-center" >Create New Order</p>
            <div className="mt-4">
                <input onChange={(event) => setName(event.target.value)} placeholder="Name" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <input onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <input onChange={(event) => { setIntParam(event, setVehicleCapacity) }} placeholder="Vehicle Capacity" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <input onChange={(event) => setPhone(event.target.value)} placeholder="Phone" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <div className="flex flex-row">
                    <div className="ml-2 flex ">
                        <p className="text-blue-900">Vehicle Type :</p>
                        <select value={vehicleStyle} onChange={(event) => setVehicleStyle(event.target.value)} className="ml-2  border-2 border-blue-900" >
                            <option value={"Pick Up"}>Pick Up</option>
                            <option value={"SUV"}>SUV</option>
                            <option value={"Car"}>Car</option>
                            <option value={"Other"}>Other</option>
                        </select>
                    </div>

                </div>

                <button onClick={saveDriver} type="button" className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0">Submit</button>

            </div>
        </div>
    </>
}

export default CreateDriver