const Navbar = () => {
    return (
        <div className="font-bold flex flex-row justify-between items-center pb-2 text-primaryColor">
            <div>
                <h1 className=" text-3xl">Ease Your Tasks</h1>
                <h2>Easing Logistics </h2>
                </div>
            <div className="flex flex-row items-center gap-10"> 
            <div>
                <ul className="flex flex-row gap-16 text-primaryColor">
                    <li className="">HOME</li>
                    <li>USAGE</li>
                    <li>DRIVERS APP</li>
                </ul></div>
            <div className="p-2 bg-primaryColor rounded">
                <a target="_blank" href="https://delivery.easeyourtasks.com" className="text-white">Launch App</a>
            </div>
            </div>
        </div>
    )
}

export default Navbar
