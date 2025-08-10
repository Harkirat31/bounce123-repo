import { useState } from "react"

import { ErrorCode, driver } from "types/src/index"
import { createDriver, getDriversAPI } from "../../services/ApiService"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { driversState } from "../../store/atoms/driversAtom"
import { loadingState } from "../../store/atoms/loadingStateAtom"
import { userAtom } from "../../store/atoms/userAtom"

const CreateDriver = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    // const [vehicleCapacity, setVehicleCapacity] = useState("")
    const [phone, setPhone] = useState("")
    const [vehicleStyle, setVehicleStyle] = useState("Pick Up")
    const setDrivers = useSetRecoilState(driversState)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [generalErrors, setGeneralErrors] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const setLoading = useSetRecoilState(loadingState)
    const user = useRecoilValue(userAtom)


    function saveDriver() {
        setFieldErrors({})
        setGeneralErrors([])

        const parsedDriverData = validateInput({ name, email, vehicleStyle, phone })
        if (parsedDriverData == null) {
            return
        }
        // add company name for sending email
        parsedDriverData.companyName = user?.companyName

        setIsSubmitting(true)
        setLoading({ isLoading: true, value: "Creating driver. Please Wait..." })
        createDriver(parsedDriverData)
            .then((result: any) => {
                if (result.isAdded) {
                    getDriversAPI().then((drivers: any) => {
                        setDrivers({
                            isLoading: false,
                            value: drivers,
                        })
                        resetInputs()
                    })
                }
                if (result.err != null || result.err != undefined) {
                    if (result.err == ErrorCode.WrongInputs) {
                        setGeneralErrors(["Some fields are missing or invalid. Please fix the errors above."])
                    }
                    if (result.err == ErrorCode.EmailAlreadyExist) {
                        setFieldErrors((prev) => ({ ...prev, email: "A driver with this email already exists" }))
                    }
                }
            })
            .catch(() => {
                setGeneralErrors(["Something went wrong. Please try again."])
            })
            .finally(() => {
                setLoading({ isLoading: false, value: null })
                setIsSubmitting(false)
            })
    }
    const resetInputs = () => {
        setName("")
        setPhone("")
        setEmail("")
    }


    const validateInput = (input: { name: string; email: string; phone: string; vehicleStyle: string }) => {
        const parsedInput = driver.safeParse(input)
        if (parsedInput.success) {
            const onlyDigits = (parsedInput.data.phone || '').replace(/\D/g, '')
            if (onlyDigits.length < 10) {
                setFieldErrors((prev) => ({ ...prev, phone: "Please enter a 10-digit phone number" }))
                return null
            }
            return parsedInput.data
        } else {
            const errors: Record<string, string> = {}
            parsedInput.error.issues.forEach((issue) => {
                const key = String(issue.path[0])
                errors[key] = mapFriendlyError(key, issue.message, input)
            })
            setFieldErrors(errors)
            return null
        }
    }

    const mapFriendlyError = (field: string, rawMessage: string, currentValues: { name: string; email: string; phone: string; vehicleStyle: string }): string => {
        switch (field) {
            case 'name':
                return 'Name is required'
            case 'email':
                return currentValues.email.trim() === '' ? 'Email is required' : 'Please enter a valid email address'
            case 'phone':
                return 'Phone is required'
            default:
                return rawMessage.charAt(0).toUpperCase() + rawMessage.slice(1)
        }
    }


    return <>
        <div className="mr-2 justify-center">
            <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900">Create Driver</h3>
                <p className="mt-0.5 text-xs text-gray-500">Enter driver details to invite them.</p>

                {generalErrors.length > 0 && (
                    <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                        {generalErrors.map((e, i) => (
                            <div key={i}>{e}</div>
                        ))}
                    </div>
                )}

                <div className="mt-2 grid grid-cols-1 gap-2">
                    <div>
                        <label className="block text-xs text-gray-700 mb-0.5">Name</label>
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Driver name"
                            type="text"
                            className={`block w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 border ${fieldErrors.name ? 'border-red-500 bg-red-50 focus:ring-red-400' : `${name.trim()==='' ? 'bg-gray-50' : 'bg-white'} border-gray-300 focus:ring-blue-500`}`}
                        />
                        {fieldErrors.name && <p className="mt-0.5 text-xs text-red-600">{fieldErrors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-xs text-gray-700 mb-0.5">Email</label>
                        <input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="name@example.com"
                            type="email"
                            className={`block w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 border ${fieldErrors.email ? 'border-red-500 bg-red-50 focus:ring-red-400' : `${email.trim()==='' ? 'bg-gray-50' : 'bg-white'} border-gray-300 focus:ring-blue-500`}`}
                        />
                        {fieldErrors.email && <p className="mt-0.5 text-xs text-red-600">{fieldErrors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-xs text-gray-700 mb-0.5">Phone</label>
                        <input
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            inputMode="tel"
                            placeholder="10-digit phone number"
                            type="text"
                            className={`block w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 border ${fieldErrors.phone ? 'border-red-500 bg-red-50 focus:ring-red-400' : `${phone.trim()==='' ? 'bg-gray-50' : 'bg-white'} border-gray-300 focus:ring-blue-500`}`}
                        />
                        {fieldErrors.phone && <p className="mt-0.5 text-xs text-red-600">{fieldErrors.phone}</p>}
                    </div>
                    <div>
                        <label className="block text-xs text-gray-700 mb-0.5">Vehicle Type</label>
                        <select
                            value={vehicleStyle}
                            onChange={(event) => setVehicleStyle(event.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={"Pick Up"}>Pick Up</option>
                            <option value={"SUV"}>SUV</option>
                            <option value={"Car"}>Car</option>
                            <option value={"Other"}>Other</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={saveDriver}
                    type="button"
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </div>
    </>
}

export default CreateDriver