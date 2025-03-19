import { useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil"
import { ErrorCode, user } from "types"
import { Wrapper } from "@googlemaps/react-wrapper"
//import { API_KEY } from "../../config"
import { userAtom } from "../store/atoms/userAtom"
import { getUserAPI, updateUserAPI } from "../services/ApiService"

const API_KEY = import.meta.env.VITE_API_KEY
const MyAccount = () => {
    return <>
        <Wrapper apiKey={API_KEY} version="beta" libraries={["marker", "places","geometry"]}>
            <Account ></Account>
        </Wrapper>
    </>
}

const Account = () => {

    const [userData, setUserData] = useRecoilState(userAtom)
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<any[]>([])
    const addressRef: any = useRef()
    const [edit, setEdit] = useState(false)
    const [isUpdated, setIsUpdated] = useState(false)




    useEffect(() => {
        if (edit) {
            setName(userData!.companyName)
            setPhone(userData!.phone)
            const options = {
                fields: ["formatted_address"],
            };

            const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, options);
            autocomplete.addListener('place_changed',
                () => {
                    if ((autocomplete.getPlace().formatted_address) || (autocomplete.getPlace().formatted_address != null) || (autocomplete.getPlace().formatted_address != undefined)) {
                        setErrorMessage([])
                        setAddress((autocomplete.getPlace().formatted_address)!)
                        console.log(autocomplete.getPlace().formatted_address)
                    }
                    else {
                        setErrorMessage(["Enter Valid Address"])
                    }
                })
        }
    }, [edit])


    const validateInput = (input: {}) => {
        let parsedInput = user.safeParse(input)
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
                if (issue.path[0] == "companyName") {
                    errors.push("Company Name:  " + issue.message)
                }
                if (issue.path[0] == "email") {
                    errors.push("Email: " + issue.message)
                }
                if (issue.path[0] == "address") {
                    errors.push("Address: " + issue.message)
                }
                if (issue.path[0] == "phone") {
                    errors.push("Phone: " + issue.message)
                }
                if (issue.path[0] == "password") {
                    errors.push("Password: " + issue.message)
                }

                setErrorMessage(errors)
            })
            return null
        }
    }

    const handleSubmit = () => {

        setErrorMessage([])

        setIsLoading(true)

        let inputData = validateInput({ email: userData!.email, companyName: name, phone, address })
        if (inputData == null) {
            setIsLoading(false)
            return
        }

        updateUserAPI(inputData).then((result: any) => {
            if (result.isUpdated) {
                getUserAPI().then((result: any) => {
                    setUserData(result)
                    setIsUpdated(true)
                    setEdit(false)
                })

            } else {
                if (result.err != null || result.err != undefined) {
                    if (result.err == ErrorCode.EmailAlreadyExist) {
                        setErrorMessage(["Email Already Exists, Please Sign In"])
                    }
                    if (result.err == ErrorCode.AddressError) {
                        setErrorMessage(["Address is not valid, Not Recognised by Google Maps"])
                    }
                }
            }
            setIsLoading(false)

        }).catch((error) => {
            console.log("Error through Catch")
            setIsLoading(false)
        })
    }
    if (userData == null) {
        return <>Loading....</>
    }
    if (edit) {
        return <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                        Company Name
                    </label>
                    <div className="mt-2">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={name}
                            required
                            className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>
                    <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                        Address
                    </label>
                    <div className="mt-2">
                        <input
                            ref={addressRef}
                            type="text"

                            //value={userData.address}
                            required
                            onChange={(event) => setAddress(event.target.value)}
                            className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                        Phone
                    </label>
                    <div className="mt-2">
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            value={phone}
                            required
                            className="pl-2  block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(event) => setPhone(event.target.value)}
                        />
                    </div>
                </div>
                <div className="mt-3 flex flex-row ">
                    {isLoading &&
                        <button
                            type="button"
                            className="mr-2 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Please wait
                        </button>
                    }
                    {!isLoading &&
                        <button
                            type="button"
                            className="mr-2 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleSubmit}
                        >
                            Sumbit
                        </button>
                    }
                    <button
                        type="button"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => {
                            setEdit(false)
                        }}
                    >
                        Cancel
                    </button>
                </div>
                {errorMessage.length > 0 &&
                    errorMessage.map((error) => {
                        return <p className="text-red-600 text-xs mt-2">{error}</p>
                    })
                }
                <div>

                </div>
            </div>
        </div>
    } else {
        return <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                            Company Name
                        </label>
                        <div className="mt-2">
                            <p className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                {userData.companyName}
                            </p>
                        </div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                            Address
                        </label>
                        <div className="mt-2">
                            <p className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                {userData.address}
                            </p>
                        </div>
                        <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                            Phone
                        </label>
                        <div className="mt-2">
                            <p className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                {userData.phone}
                            </p>
                        </div>
                    </div>

                    {isUpdated && <h2 className="text-green-800">Updated Successfully</h2>}

                    <div className="mt-3">

                        <button
                            type="button"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => {
                                setEdit(true)
                                setIsUpdated(false)
                            }}
                        >
                            Edit Details
                        </button>
                    </div>

                </div >
            </div>
        </>

    }
}

export default MyAccount
