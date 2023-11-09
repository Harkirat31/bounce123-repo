import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { getOrdersIdsAtom, ordersAtom, ordersSearchDate } from "../store/atoms/orderAtom"
import { DriverType, OrderType, PathOrderType } from "types"
import { createPathAtom, getSavedPathById, savedPaths } from "../store/atoms/pathAtom"
import { createPath, getPathsAPI } from "../services/ApiService"
import { getDrivers } from "../store/selectors/driversSelector"

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
    const paths = useRecoilValue(savedPaths)
    const orderIds = useRecoilValue(getOrdersIdsAtom())

    const getSrNoFororderId = (orderId: string) => {
        return orderIds.findIndex((x) => x === orderId) + 1
    }

    return <div className="flex flex-col items-center  border-t-2 border-grey-600 ">
        <button onClick={() => setShowCreatePath(true)} type="button" className="my-2 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-2 py-1 text-center mr-3 md:mr-0">Create Path</button>
        <table className="text-sm  text-center text-gray-500 ">
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
                {paths.length > 0 &&
                    paths.map((pathElement) => {
                        return <PathRow path={pathElement} callbackToCalculateSrNo={getSrNoFororderId}></PathRow>
                    })
                }
            </tbody>
        </table>
    </div>
}

const CreatePath = ({ setShowCreatePath }: any) => {
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const [pathOrders, setPathOrders] = useRecoilState(createPathAtom)
    //const orders = useRecoilValue(ordersAtom)
    const orderIds = useRecoilValue(getOrdersIdsAtom())
    const [dropDownValue, setDropDownValue] = useState<number>(1)
    const [orderSetForPath, setorderSetForPath] = useState<(string | undefined)[]>([])
    const [reset, setReset] = useState(true)
    const [_paths, setSavedPaths] = useRecoilState(savedPaths)
    const date = useRecoilValue(ordersSearchDate)

    useEffect(() => {
        setorderSetForPath([...orderIds])
        setPathOrders([])
        setDropDownValue(1)
        return () => {
            setPathOrders([])
        };
    }, [orderIds, reset])

    const getSrNoFororderId = (orderId: string) => {
        return orderIds.findIndex((x) => x === orderId) + 1
    }

    return <div className="flex flex-col items-center  border-t-2 border-grey-600">
        <button onClick={() => setShowCreatePath(false)} type="button" className="my-2 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-2 py-1 text-center mr-3 md:mr-0">Show All Paths</button>

        <div className="mx-2 flex flex-col justify-center items-center">
            <div className="grid grid-cols-8 items-center justify-center">
                {pathOrders.map((pathnode) => {
                    return <>
                        <p className="text-center w-6 h-6 m-0.5 text-black bg-red-400 border-gray-300 rounded-xl">
                            {getSrNoFororderId(pathnode)}
                        </p>
                    </>
                })}
                {pathOrders.length > 0 &&
                    <div className="flex flex-row">
                        <button
                            onClick={() => {
                                createPath({ show: true, path: pathOrders, dateOfPath: date }).then(async (result) => {
                                    getPathsAPI(date).then((data: any) => {
                                        setSavedPaths([...data]);
                                        reset ? setReset(false) : setReset(true)
                                    }).catch(() => alert("Error Saving Path"))

                                }).catch((error) => {
                                    alert(error)
                                })
                            }}
                            className="my-2 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-2 py-1 text-center md:mr-0">Save</button>
                        <button onClick={() => { reset ? setReset(false) : setReset(true) }} className="ml-2 my-2 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-2 py-1 text-center mr-3 md:mr-0">Reset</button>
                    </div>
                }
            </div>
            <div>
                {orderSetForPath.length > 0 &&
                    <select ref={selectRef} value={dropDownValue} onChange={(event) => { setDropDownValue(parseInt(event.target.value)) }} className="ml-2  border-2 border-blue-900" >
                        {orderSetForPath.map((orderId) => {
                            return <>
                                <option value={getSrNoFororderId(orderId!)}>{getSrNoFororderId(orderId!)}</option>
                            </>
                        })}
                    </select>}

                {orderSetForPath.length > 0 && <button onClick={
                    () => {
                        setPathOrders([...pathOrders, orderIds[dropDownValue - 1]!])
                        let newSet = orderSetForPath.filter((orderId) => orderId != orderIds[dropDownValue - 1]!)
                        console.log(newSet)
                        setorderSetForPath([...newSet])
                        if (newSet.length > 0) {
                            setDropDownValue(getSrNoFororderId(newSet[0]!))
                        }

                    }
                } className="ml-2 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded px-2 py-1 text-center" >
                    Add
                </button>}
            </div>
        </div>
    </div>
}


const PathRow = ({ path, callbackToCalculateSrNo }: { path: PathOrderType, callbackToCalculateSrNo: (orderId: string) => number }) => {
    const [pathData, setPathData] = useRecoilState(getSavedPathById(path.pathId))
    const drivers = useRecoilValue(getDrivers)
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const [dropDownItem, setDropDownItem] = useState<{ driverId: string, driverName: string } | "Select">({ driverId: pathData!.driverId ? pathData!.driverId : "Select", driverName: pathData?.driverName ? pathData?.driverName : "Select" })
    const handleShowToggle = () => {
        if (pathData!.show) {
            setPathData({ ...pathData!, show: false })
        }
        else {
            setPathData({ ...pathData!, show: true })
        }
    }
    function handleDropdownChanged(event: ChangeEvent<HTMLSelectElement>): void {
        setDropDownItem({ driverId: event.target.value, driverName: selectRef.current!.options[selectRef.current!.selectedIndex].text })
        //console.log(event.target.value)
    }

    return <>
        <tr>
            <td> <input onChange={(event) => handleShowToggle()} type="checkbox" checked={pathData!.show} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"></input></td>
            <td>
                <div className="grid grid-flow-col">

                    {path.path.map((node) => {
                        return <div>
                            <p className="text-center w-5 h-5 m-0.5 text-black bg-red-400 border-gray-300 rounded-xl">{callbackToCalculateSrNo(node)}</p>
                        </div>
                    })}

                </div>
            </td>
            <td>
                <select ref={selectRef} value={dropDownItem == "Select" ? "Select" : dropDownItem.driverId} onChange={(event) => handleDropdownChanged(event)} className="ml-2  border-2 border-blue-900" >
                    <option value={"Select"}>Select</option>
                    {drivers.map((driver: DriverType) => {
                        return <>
                            <option value={driver.uid}>{driver.name}</option>
                        </>
                    })}
                </select>
            </td>
            <td className="px-6 py-4 text-right">
                <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Send SMS</button>
                <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</button>
            </td>

        </tr>
    </>
}