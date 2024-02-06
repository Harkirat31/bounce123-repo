import { useNavigate } from "react-router-dom"

const VerifyEmail = () => {

    const navigate = useNavigate()

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-10 w-auto"
                //src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                //alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Verification Email has been sent, please verify the account and sign in again
                </h2>
                <p className="mt-10 text-center text-lg text-gray-500">
                    <button type="button" onClick={() => navigate('/signin')} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    )
}

export default VerifyEmail
