import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { resetPasswordAPI } from "../services/ApiService"


const Reset = () => {

    const [email, setEmail] = useState("")
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = () => {
        if (email.length == 0) {
            setErrorMessage("Enter Email")
        }
        resetPasswordAPI(email).then((result: any) => {
            console.log(result)
            if (result.reset) {
                setErrorMessage("Reset password Email Sent. Please check your Email / Spam")
            } else {
                setErrorMessage("Email Not exists / Server Error")
            }
        }).catch((error) => {
            setErrorMessage("Email Not exists / Server Error")
        })
    }

    return <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
                className="mx-auto h-10 w-auto"
            //src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            //alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Reset Password
            </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <a onClick={() => navigate('/signin')} className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                            Sign In
                        </a>
                    </div>
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
                        Reset
                    </button>
                }
            </div>
            {errorMessage.length > 0 &&
                <p className="text-red-600 text-xs mt-2">{errorMessage}</p>
            }
        </div>
    </div>
}
export default Reset