import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { ordersSearchDate } from "../store/atoms/orderAtom"
import { DriverType, PathOrderType } from "types"
import { createPathAtom, orderSetForPathCreation, savedPaths } from "../store/atoms/pathAtom"
import { assignPathAPI, createPath, getPathsAPI } from "../services/ApiService"
import { getDrivers } from "../store/selectors/driversSelector"
import { getOrderIds } from "../store/selectors/orderSelector"
import { AiFillDelete } from 'react-icons/ai';
import { getPathById } from "../store/selectors/pathSelector"
import { useNavigate } from "react-router-dom";

const PathArea = () => {
    const [showCreatePath, setShowCreatePath] = useState(false)
    return (
        <div className="border-t-2 border-grey-600">
            <div className="flex justify-center">
                <button onClick={() => setShowCreatePath(false)} type="button" className={`m-2 text-sm ${showCreatePath ? "text-black bg-gray-300" : "text-white bg-blue-700"}  px-2 py-1`}>Show All Paths</button>
                <button onClick={() => setShowCreatePath(true)} type="button" className={`m-2 text-sm ${!showCreatePath ? "text-black bg-gray-300" : "text-white bg-blue-700"}  px-2 py-1`}>Create Path</button>
            </div>
            {showCreatePath && <CreatePath setShowCreatePath={setShowCreatePath}></CreatePath>}
            {!showCreatePath && <Paths setShowCreatePath={setShowCreatePath}></Paths>}
        </div>
    )
}

export default PathArea

const Paths = ({ setShowCreatePath }: any) => {
    const paths = useRecoilValue(savedPaths)
    const orderIds = useRecoilValue(getOrderIds)
    const navigate = useNavigate()

    const getSrNoFororderId = (orderId: string) => {
        return orderIds.findIndex((x) => x === orderId) + 1
    }

    return <div className="flex flex-col items-center ">
        {orderIds.length === 0 && <div className="flex flex-col justify-center h-full text-center items-center">
            <p>No order is created for this day!!</p>
            <a className="underline text-blue-900" onClick={() => navigate('/orders')} >Create new orders</a>
        </div>}
        {orderIds.length !== 0 && paths.length === 0 && <div className="flex flex-col justify-center h-full text-center items-center">
            <p>No Path is created!!</p>
            <a className="underline text-blue-900" onClick={() => setShowCreatePath(true)} >Create a Path</a>
        </div>}
        {orderIds.length > 0 && paths.length > 0 &&
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
        }

    </div>
}

const CreatePath = ({ setShowCreatePath }: any) => {
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const [pathOrders, setPathOrders] = useRecoilState(createPathAtom)
    const orderIds = useRecoilValue(getOrderIds)
    const [dropDownValue, setDropDownValue] = useState<number | "Select">("Select")
    const [orderSetForPath, setorderSetForPath] = useRecoilState(orderSetForPathCreation)
    const [reset, setReset] = useState(true)
    const [paths, setSavedPaths] = useRecoilState(savedPaths)
    const date = useRecoilValue(ordersSearchDate)

    useEffect(() => {
        setorderSetForPath([...orderIds] as string[])
        setPathOrders([])
        //setDropDownValue("Select Order")
        return () => {
            setPathOrders([])
        };
    }, [orderIds, reset, paths])

    const getSrNoFororderId = (orderId: string) => {
        return orderIds.findIndex((x) => x === orderId) + 1
    }

    return <div className="flex flex-col items-center">
        <div className="mx-2 flex flex-col justify-center items-center">
            {orderSetForPath.length == 0 &&
                <div className="h-full">
                    <p> All Orders have been added to paths</p>
                    <p> Or No order is created for this date!!</p>
                </div>
            }
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
                        <option value="Select" >Select Order</option>
                        {orderSetForPath.map((orderId) => {
                            return <>
                                <option value={getSrNoFororderId(orderId!)}>{getSrNoFororderId(orderId!)}</option>
                            </>
                        })}
                    </select>}

                {orderSetForPath.length > 0 && <button onClick={
                    () => {
                        if (dropDownValue === "Select") {
                            return
                        }
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
    const [pathData, setPathData] = useRecoilState(getPathById(path.pathId!))
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
    }

    const hanldeSendSMS = () => {
        if (dropDownItem == "Select") {
            return
        }
        if (dropDownItem.driverId == "Select") {
            return
        }
        let pathArgs = { ...pathData, driverId: dropDownItem.driverId, driverName: dropDownItem.driverName }

        assignPathAPI(pathArgs as PathOrderType).then((result) => {
            setPathData(pathArgs as PathOrderType)
            alert("Assigned and Sent to driver")
        }).catch((_error) => {
            alert("Error")
        })

        // let order1: any = {
        //     name: "Harkirat Singh",
        //     address: "19 Simmons Blvd,Brampton ON",
        //     rentingItem: "Animal Kingdom",
        //     instructions: "Deliver Before 12"
        // }
        // let order2: any = {
        //     name: "Kamaldeep",
        //     address: "19 Simmons Blvd,Brampton ON",
        //     rentingItem: "Animal Kingdom",
        //     instructions: "Deliver Before 9"
        // }
        // let orders: any[] = []
        // orders.push(order1)
        // orders.push(order2)

        // let message = `Orders for 12/11/2023: \n\n`
        // orders.forEach((order, index) => {
        //     //message = message + "https://minipunjabincanada/update/322323233232323"
        //     message = message + `Order Sr No ${index + 1} \n`
        //     message = message + `Name: ${order.name} \n Address: ${order.address} \n Delivery Items: ${order.rentingItem} \n Instructions: ${order.instructions} \n\n`

        // })

        // axios.post('https://textbelt.com/text', {
        //     phone: '4379864033',
        //     message: message,
        //     key: '938113449037b129ba9966d882fa3de627c5a7b1HEm6hpQSEnEHKqztObgLzg3tn',
        // }).then(response => {
        //     console.log(response.data);
        // })

    }

    return <>
        <tr>
            <td> <input onChange={(event) => handleShowToggle()} type="checkbox" checked={pathData!.show} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"></input></td>
            <td>
                <div className="grid grid-cols-5 justify-between">

                    {path.path.map((node) => {
                        return <div>
                            <p className="text-center w-5 h-5 mx-2 my-0.5 text-black bg-red-400 border-gray-300 rounded-xl">{callbackToCalculateSrNo(node)}</p>
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
            <td className="px-6 py-4 flex">
                <button onClick={hanldeSendSMS} className="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline">Send SMS</button>
                <button className="text-2xl"><AiFillDelete></AiFillDelete></button>
            </td>

        </tr>
    </>
}