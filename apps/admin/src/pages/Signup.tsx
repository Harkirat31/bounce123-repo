import { useEffect, useRef, useState } from "react"
import { signupAPI, verifyEmailAPI } from "../services/ApiService"
import { useNavigate } from "react-router-dom"
import { ErrorCode, user } from "types"
import { Wrapper } from "@googlemaps/react-wrapper";
import logo from "../assets/logo.png"
//import { API_KEY } from "../../config";

const API_KEY = import.meta.env.VITE_API_KEY
const Signup2 = () => {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState<any[]>([])
    const addressRef: any = useRef()


    useEffect(() => {
        const options = {
            fields: ["formatted_address"],
        };

        const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, options);
        autocomplete.addListener('place_changed',
            () => {
                if ((autocomplete.getPlace().formatted_address) || (autocomplete.getPlace().formatted_address != null) || (autocomplete.getPlace().formatted_address != undefined)) {
                    setErrorMessage([])
                    setAddress((autocomplete.getPlace().formatted_address)!)
                }
                else {
                    setErrorMessage(["Enter Valid Address"])
                }
            })
    }, [])


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

        let inputData = validateInput({ email, password, companyName: name, phone, address })
        if (inputData == null) {
            setIsLoading(false)
            return
        }

        signupAPI(inputData).then((result: any) => {
            if (result.success) {
                verifyEmailAPI(email).then((result: any) => {
                    if (result.sent) {
                        navigate('/verify')
                    } else {
                        setErrorMessage(["Server Error (Email Verification)"])
                    }
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
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-16 w-auto"
                    src={logo}
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Create New Account
                </h2>
            </div>

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">

                <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Email address
                    </label>
                    <div className="mt-2">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                        Company Name
                    </label>
                    <div className="mt-2">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            //autoComplete="email"
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
                            id="address"
                            name="address"
                            type="text"
                            ref={addressRef}
                            required
                            className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(event) => setAddress(event.target.value)}
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
                            required
                            className="pl-2  block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(event) => setPhone(event.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </label>
                    </div>
                    <div className="mt-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-3">
                    {isLoading &&
                        <button
                            type="button"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Please wait
                        </button>
                    }
                    {!isLoading &&
                        <button
                            type="button"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleSubmit}
                        >
                            Sign Up
                        </button>
                    }
                </div>
                {errorMessage.length > 0 &&
                    errorMessage.map((error) => {
                        return <p className="text-red-600 text-xs mt-2">{error}</p>
                    })
                }
                <div>

                </div>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already a member?{' '}
                    <button type="button" onClick={() => navigate('/admin')} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    )
}


const Signup = () => {
    return <>
        <Wrapper apiKey={API_KEY} version="beta" libraries={["places"]}>
            <Signup2 ></Signup2>
        </Wrapper>
    </>
}
export default Signup
