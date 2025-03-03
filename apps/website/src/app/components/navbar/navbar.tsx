import Image from "next/image"



const Navbar = () => {
    return (
        <div className="font-bold flex flex-row justify-between items-center pb-2 text-primaryColor border-b-2">

            <div className="flex flex-row items-center">
                <div className="relative w-10 h-10 sm:w-16 sm:h-16 mr-2 sm:mr-4">
                  <Image className=" rounded-2xl" fill={true} objectFit="cover" src="/logo.png" alt="1"></Image>
                </div>
                <div>
                    <h1 className="text-lg sm:text-3xl text-nowrap">Ease Your Tasks</h1>
                    <h2 className="text-[12px] sm:text-lg text-nowrap">Easing Logistics </h2>
                </div>

            </div>
            <div className="flex flex-row items-center gap-10">
                <div >
                    <ul className="hidden ml-10 md:flex flex-row gap-10 lg:gap-16 text-primaryColor text-nowrap">
                        <li className="">
                            <a href="/">HOME</a>
                        </li>
                        <li>
                            <a href="#usage">USAGE</a></li>
                        <li><a href="#mobile-app">DRIVERS APP</a></li>
                    </ul></div>
                <div className="p-1 sm:p-2 bg-primaryColor rounded">
                    <a target="_blank" href="https://delivery.easeyourtasks.com" className="text-white text-nowrap text-sm sm:text-base">Launch App</a>
                </div>
            </div>
        </div>
    )
}

export default Navbar
