import { useState } from "react"
import logo from "../assets/BounceLogo-Main.webp"
import { useRecoilState } from "recoil";
import { token } from "../store/atoms/tokenAtom";
import { NavLink } from "react-router-dom";


const AppBar = () => {
  const [visibility, setVisibility] = useState(false)
  const [tokenValue, setTokenValue] = useRecoilState(token)


  const logout = () => {
    setTokenValue(null)
    window.location.assign("/")
  }

  const toggleMobileNavBar = () => {
    if (visibility) {
      setVisibility(false)
    }
    else {
      setVisibility(true)
    }
  }

  if (tokenValue) {
    return (
      <div>
        <nav className="bg-white fixed w-full z-20 top-0 left-0 border-b border-gray-200">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1">
            <a href="" className="flex items-center">
              <img src={logo} className="h-14 mr-3" alt="Bounce123 Logo" />
            </a>
            <div className="flex md:order-2">
              <button type="button" onClick={logout} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0">Logout</button>
              <button type="button" onClick={toggleMobileNavBar} className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                <svg className="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                </svg>
              </button>
            </div>
            {visibility && <div className="items-center justify-between w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
              <NavMenu setVisibility={setVisibility}></NavMenu>
            </div>}

            {!visibility && <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
              <NavMenu setVisibility={setVisibility}></NavMenu>
            </div>}
          </div>
        </nav>
        <div className='h-16'></div>

      </div>
    )
  } else {
    return <></>
  }

}

const NavMenu = (props: any) => {

  return <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
    <li>
      <NavLink to={"/"} onClick={() => { props.setVisibility(false) }}
        className={({ isActive, isPending }) =>
          isPending ? getStyle(false) : isActive ? getStyle(true) : getStyle(false)
        }
        aria-current="page">Map</NavLink>
    </li>
    <li>
      <NavLink to={"/orders"} onClick={() => { props.setVisibility(false) }}
        className={({ isActive, isPending }) =>
          isPending ? getStyle(false) : isActive ? getStyle(true) : getStyle(false)
        }>Orders</NavLink>
    </li>
    {/* <li>
      <button onClick={() => { navigate("/delerables"); props.setVisibility(false) }} className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">Manage Deliverables</button>
    </li> */}
    <li>
      <NavLink to={"/drivers"} onClick={() => { props.setVisibility(false) }} className={({ isActive, isPending }) =>
        isPending ? getStyle(false) : isActive ? getStyle(true) : getStyle(false)
      }>
        Manage Drivers</NavLink>
    </li>
  </ul>
}

const getStyle = (active: boolean) => {
  if (active) {
    return "block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0"
  }
  else {
    return "block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
  }
}


export default AppBar
