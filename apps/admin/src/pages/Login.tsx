import { useState } from "react"
import { signInAPI, verifyEmailAPI } from "../services/ApiService"
import { useSetRecoilState } from "recoil"
import { token } from "../store/atoms/tokenAtom"
import { useNavigate } from "react-router-dom"
import { ErrorCode, userSignIn } from "types"
import logo from "../assets/logo.png"


const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const setToken = useSetRecoilState(token)
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState<any[]>([])
    const [emailVerified, setEmailVerified] = useState(false)



    const validateInput = (input: {}) => {
        let parsedInput = userSignIn.safeParse(input)
        if (parsedInput.success) {
            return parsedInput.data
        }
        else {
            let errors: any[] = []
            parsedInput.error.issues.forEach((issue) => {
                if (issue.path[0] == "email") {
                    errors.push("Email: " + issue.message)
                }
                if (issue.path[0] == "password") {
                    errors.push("Password :" + "Cannot be Empty")
                }

                setErrorMessage(errors)
            })
            return null
        }
    }

    const handleVerifyEmail = () => {
        if (email == "") {
            setErrorMessage(["Enter Email"])
            return
        }
        setErrorMessage(["Please Wait ..."])
        verifyEmailAPI(email).then((result: any) => {
            if (result.sent) {
                navigate('/verify')
            } else {
                setErrorMessage(["Server Error (Email Verification)"])
            }
        })
    }

    const handleSubmit = () => {

        setIsLoading(true)

        let inputData = validateInput({ email, password })
        if (inputData == null) {
            setIsLoading(false)
            return
        }

        signInAPI(email, password).then((result: any) => {
            if (result.token) {
                setToken(result.token)
                window.location.assign("/")

            } else {
                if (result.err != null || result.err != undefined) {
                    if (result.err == ErrorCode.UserNotApproved) {
                        setErrorMessage(["User is not Approved by admin, Please email at info@easeyourtasks.com to resolve at the earliest."])
                    }
                    else if (result.err == ErrorCode.WorngCredentials) {
                        setErrorMessage(["Wrong Credentials, Please check again"])
                    }
                    else if (result.err == ErrorCode.EmailNotVerified) {
                        setErrorMessage(["Email Not Verified"])
                        setEmailVerified(true)
                    }
                    else {
                        setErrorMessage(["Server Error, Please try again after some time"])
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
                //src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                //alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
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
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </label>
                        <div className="text-sm">
                            <a onClick={() => navigate('/reset')} className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                                Forgot password?
                            </a>
                        </div>
                    </div>
                    <div className="mt-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
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
                            Sign In
                        </button>
                    }
                </div>
                {errorMessage.length > 0 &&
                    errorMessage.map((error) => {
                        return <p className="text-red-600 text-xs mt-2">{error}</p>
                    })
                }
                {emailVerified && <a onClick={handleVerifyEmail} className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                    Send Verification link
                </a>}


                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <button type="button" onClick={() => navigate('/signup')} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Create New Account
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Login
