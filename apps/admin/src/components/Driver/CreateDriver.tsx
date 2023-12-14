import { useState } from "react"

import { ErrorCode, driver } from "types/src/index"
import { createDriver, getDriversAPI } from "../../services/ApiService"
import { useSetRecoilState } from "recoil"
import { driversState } from "../../store/atoms/driversAtom"

const CreateDriver = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    // const [vehicleCapacity, setVehicleCapacity] = useState("")
    const [phone, setPhone] = useState("")
    const [vehicleStyle, setVehicleStyle] = useState("Pick Up")
    const setDrivers = useSetRecoilState(driversState)
    const [errorMessage, setErrorMessage] = useState<any[]>([])

    function saveDriver() {
        let parsedDriverData = validateInput({ name, email, vehicleStyle, phone })
        if (parsedDriverData == null) {
            return
        }
        createDriver(parsedDriverData).then((result: any) => {
            if (result.isAdded) {
                getDriversAPI().then((drivers: any) => {
                    setDrivers({
                        isLoading: false,
                        value: drivers
                    })
                    resetInputs()
                })
            }
            if (result.err != null || result.err != undefined) {
                if (result.err == ErrorCode.WrongInputs) {
                    setErrorMessage(["Wrong Inputs"])
                }
                if (result.err == ErrorCode.EmailAlreadyExist) {
                    setErrorMessage(["Driver of this Email already Exists"])
                }
            }
        }).catch((result) => {
            alert("Not Added, Errors in Detail or Internet is down")
        })
    }
    const resetInputs = () => {
        setName("")
        setPhone("")
        setEmail("")
    }


    const validateInput = (input: {}) => {
        let parsedInput = driver.safeParse(input)
        if (parsedInput.success) {
            try {
                let phone = parseInt(parsedInput.data.phone)
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
                if (issue.path[0] == "name") {
                    errors.push("Name:  " + issue.message)
                }
                if (issue.path[0] == "vehicleCapacity") {
                    errors.push("Capacity:  " + issue.message)
                }
                if (issue.path[0] == "phone") {
                    errors.push("Phone: " + issue.message)
                }
                if (issue.path[0] == "email") {
                    errors.push("Email: " + issue.message)
                }

                setErrorMessage(errors)
            })
            return null
        }
    }


    return <>
        <div className="mr-4 justify-center">
            <p className="text-blue-900 text-center" >Create New Driver</p>
            <div className="mt-4">
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
                {/* <input onChange={(event) => { setIntParam(event, setVehicleCapacity) }} placeholder="Vehicle Capacity" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input> */}
                <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone" type="text" className="block w-full p-2 mb-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"></input>
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
                {errorMessage.length > 0 &&
                    errorMessage.map((error) => {
                        return <p className="text-red-600 text-xs mt-2">{error}</p>
                    })
                }
                <button onClick={saveDriver} type="button" className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0">Submit</button>

            </div>
        </div>
    </>
}

export default CreateDriver