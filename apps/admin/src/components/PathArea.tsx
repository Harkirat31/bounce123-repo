import { useEffect, useRef, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { ordersAtom } from "../store/atoms/orderAtom"
import { OrderType } from "types"
import { createPathAtom } from "../store/atoms/createPathAtom"

const PathArea = () => {
    const [showCreatePath, setShowCreatePath] = useState(false)
    return (
        <div >
            {showCreatePath && <CreatePath setShowCreatePath={setShowCreatePath}></CreatePath>}
            {!showCreatePath && <Paths setShowCreatePath={setShowCreatePath}></Paths>}
        </div>
    )
}

export default PathArea

const Paths = ({ setShowCreatePath }: any) => {

    return <div className="flex flex-col items-center  border-t-2 border-grey-600 ">
        <button onClick={() => setShowCreatePath(true)} type="button" className="my-2 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-2 py-1 text-center mr-3 md:mr-0">Create Path</button>
        <table className="w-full text-sm  text-center text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-3 py-3 ">
                        Show
                    </th>
                    <th scope="col" className="text-left px-1 py-3">
                        Path
                    </th>
                    <th scope="col" className="px-1 py-3">
                        Assign To
                    </th>
                    <th scope="col" className="px-3 py-3">
                        <span className="sr-only">Edit</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td> <input type="checkbox" value="" className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"></input></td>
                    <td>
                        <div className="grid grid-cols-6">
                            <p className="text-center w-5 h-5 m-0.5 text-black bg-red-400 border-gray-300 rounded-xl">
                                1
                            </p>
                            <p className="text-center w-5 h-5 m-0.5 text-black bg-red-400 border-gray-300 rounded-xl">
                                1
                            </p>
                            <p className="text-center w-5 h-5 m-0.5 text-black bg-red-400 border-gray-300 rounded-xl">
                                1
                            </p>
                            <p className="text-center w-5 h-5 m-0.5 text-black bg-red-400 border-gray-300 rounded-xl">
                                1
                            </p>

                        </div>

                    </td>
                    <td></td>
                    <td className="px-6 py-4 text-right">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    </td>
                </tr>


            </tbody>
        </table>
    </div>
}

const CreatePath = ({ setShowCreatePath }: any) => {
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const [pathOrders, setPathOrders] = useRecoilState(createPathAtom)
    const orders = useRecoilValue(ordersAtom)
    const [dropDownValue, setDropDownValue] = useState<number>(1)
    const [orderSetForPath, setorderSetForPath] = useState<OrderType[]>([])
    useEffect(() => {
        setorderSetForPath([...orders])
        setPathOrders([])
        setDropDownValue(1)
        return () => {
            setPathOrders([])
        };
    }, [orders])

    const getSrNoFororderId = (orderId: string) => {
        return orders.findIndex((order) => order.orderId === orderId) + 1
    }

    return <div className="flex flex-col items-center  border-t-2 border-grey-600">
        <button onClick={() => setShowCreatePath(false)} type="button" className="my-2 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-2 py-1 text-center mr-3 md:mr-0">Show All Paths</button>

        <div className="flex justify-center items-center">
            <div>
                {pathOrders.map((pathnode) => {
                    return <>
                        {getSrNoFororderId(pathnode)}
                    </>
                })}
            </div>
            {orderSetForPath.length > 0 &&
                <select ref={selectRef} value={dropDownValue} onChange={(event) => { setDropDownValue(parseInt(event.target.value)) }} className="ml-2  border-2 border-blue-900" >
                    {orderSetForPath.map((order: OrderType) => {
                        return <>
                            <option value={getSrNoFororderId(order.orderId!)}>{getSrNoFororderId(order.orderId!)}</option>
                        </>
                    })}
                </select>}

            {orderSetForPath.length > 0 && <button onClick={
                () => {
                    setPathOrders([...pathOrders, orders[dropDownValue - 1].orderId!])
                    let newSet = orderSetForPath.filter((order: OrderType) => order.orderId != orders[dropDownValue - 1].orderId!)
                    console.log(newSet)
                    setorderSetForPath([...newSet])
                    if (newSet.length > 0) {
                        setDropDownValue(getSrNoFororderId(newSet[0].orderId!))
                    }

                }
            } className="ml-2 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded px-2 py-1 text-center" >
                Add
            </button>}
        </div>
    </div>
}