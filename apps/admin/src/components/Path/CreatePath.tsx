import { useEffect, useRef, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { createPathAtom, orderSetForPathCreation, savedPaths } from "../../store/atoms/pathAtom";
import { getOrderIds } from "../../store/selectors/orderSelector";
import { ordersSearchDate } from "../../store/atoms/orderAtom";
import { createPath, getPathsAPI } from "../../services/ApiService";
import { userAtom } from "../../store/atoms/userAtom";
import { FaLongArrowAltDown } from "react-icons/fa";


const CreatePath = ({ setShowCreatePath }: any) => {
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const [pathOrders, setPathOrders] = useRecoilState(createPathAtom)
    const orderIds = useRecoilValue(getOrderIds)
    const [dropDownValue, setDropDownValue] = useState<number | "Select">("Select")
    const [orderSetForPath, setorderSetForPath] = useRecoilState(orderSetForPathCreation)
    const [reset, setReset] = useState(true)
    const [paths, setSavedPaths] = useRecoilState(savedPaths)
    const date = useRecoilValue(ordersSearchDate)
    const [saving, setSaving] = useState(false)
    const [selectdropdoenError, setSelectDropdownError] = useState(false)
    const user = useRecoilValue(userAtom)
    const [isEnd, setEnd] = useState(false)

    useEffect(() => {
        setorderSetForPath([...orderIds] as string[])
        setPathOrders([])
        return () => {
            setPathOrders([])
        };
    }, [orderIds, reset, paths])

    const getSrNoFororderId = (orderId: string) => {
        return orderIds.findIndex((x) => x === orderId) + 1
    }

    const onSaveClick = () => {
        setSaving(true)
        createPath({ show: true, path: pathOrders, dateOfPath: date }).then((result) => {
            getPathsAPI(date).then((data: any) => {
                setSavedPaths([...data]);
                reset ? setReset(false) : setReset(true)
                setSaving(false)
            }).catch(
                (err) => {
                    alert("Error Fetching Paths, Please Refresh the page")
                    setSaving(false)
                })
            setShowCreatePath(false)

        }).catch((error) => {
            alert(error)
            setSaving(false)
        })
    }
    const addHandler = () => {
        if (dropDownValue === "Select") {
            setSelectDropdownError(true)
            return
        }
        if (selectdropdoenError) {
            setSelectDropdownError(false)
        }
        setPathOrders([...pathOrders, orderIds[dropDownValue - 1]!])
        let newSet = orderSetForPath.filter((orderId) => orderId != orderIds[dropDownValue - 1]!)
        console.log(newSet)
        setorderSetForPath([...newSet])
        if (newSet.length > 0) {
            setDropDownValue("Select")
        }

    }

    const onDropHandler = (ev: any) => {
        const data = ev.dataTransfer.getData("application/my-app");
        try {
            let startPosition = parseInt((ev.target).getAttribute('data-id'))
            let removedElementPosition = parseInt(data)
            if (startPosition == removedElementPosition) {
                ev.preventDefault();
            }
            let pathOrderCopy = [...pathOrders]
            let removedElement = pathOrderCopy[removedElementPosition]
            //let shiftStartElement = pathOrderCopy[startPosition]

            if (startPosition < removedElementPosition) {
                pathOrderCopy.splice(startPosition, 0, removedElement)
                pathOrderCopy.splice(removedElementPosition + 1, 1)
            } else {
                pathOrderCopy.splice(startPosition + 1, 0, removedElement)
                pathOrderCopy.splice(removedElementPosition, 1)
            }
            setPathOrders(pathOrderCopy)
        }
        catch {

        }

    }
    const onDragStartHandler = (ev: any) => {
        ev.dataTransfer.setData("application/my-app", (ev.target).getAttribute('data-id'));
    }
    const onDragOverHandler = (ev: any) => {
        ev.preventDefault();

    }

    return <div className="text-sm flex flex-col items-center">
        <div className="mx-2 mt-2 flex flex-col justify-center items-center">
            {orderSetForPath.length == 0 &&
                <div className="h-full">
                    <p> All Orders have been added to paths</p>
                    <p> Or No order is created for this date!!</p>
                </div>
            }

            <div className="flex flex-col items-center" >
                <div className="mt-4 flex flex-col items-center justify-center">
                    {(user && (pathOrders.length != 0 || orderSetForPath.length > 0)) &&
                        <div className="flex flex-col items-center pb-1">
                            <div className="flex flex-col items-center border-2 rounded-xl p-0.5 mb-1 ">
                                <p>Start</p>
                                <p className="underline" >{`${user.companyName} `}</p>
                            </div>
                            <FaLongArrowAltDown />
                        </div>}
                    {pathOrders.map((pathnode, index) => {
                        return (
                            <div className="flex flex-col items-center pb-1" >
                                <div data-id={`${index}`} id={`p${pathnode}`} onDragStart={onDragStartHandler} draggable="true" onDrop={onDropHandler} onDragOver={onDragOverHandler}
                                    className="flex flex-row items-center border-2 rounded-xl p-0.5">
                                    <p data-id={`${index}`} >{`Order`}</p>
                                    <p data-id={`${index}`} className="text-center px-2">
                                        {`Sr. No. ${getSrNoFororderId(pathnode)}`}
                                    </p>
                                </div>
                                {<FaLongArrowAltDown />}
                            </div>
                        )
                    })}
                    {((orderSetForPath.length == 0 && pathOrders.length != 0) || isEnd) &&
                        <div className="flex flex-col items-center pb-1">
                            <div className="flex flex-col items-center border-2 rounded-xl p-0.5 mb-1 ">
                                <p>End</p>
                            </div>
                        </div>}
                </div>
                <div className="flex flex-row" >
                    {(orderSetForPath.length > 0 && !isEnd) &&
                        <div className="flex flex-row items-center">
                            <p>{`Add order at position ${pathOrders.length + 1} :`}</p>
                            <select ref={selectRef} value={dropDownValue} onChange={(event) => { setDropDownValue(parseInt(event.target.value)) }} className={`ml-2   ${selectdropdoenError ? "border-red-500 border-4" : "border-blue-900 border-2"}`} >
                                <option value="Select" >Select</option>
                                {orderSetForPath.map((orderId) => {
                                    return <>
                                        <option value={getSrNoFororderId(orderId!)}>{`Sr.No ${getSrNoFororderId(orderId!)}`}</option>
                                    </>
                                })}
                            </select>
                        </div>
                    }

                    {(orderSetForPath.length > 0 && !isEnd) &&
                        <>
                            <button onClick={addHandler}
                                className="ml-2 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded px-2 py-1 text-center" >
                                Add
                            </button>
                            <button onClick={() => {
                                if (pathOrders.length > 0) {
                                    setEnd(true)
                                }
                            }
                            }
                                className="ml-2 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded px-2 py-1 text-center" >
                                End
                            </button>
                        </>}
                </div>

                {pathOrders.length > 0 &&
                    <div className="flex flex-row">
                        <button
                            onClick={onSaveClick}
                            className="my-2 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-2 py-1 text-center md:mr-0">
                            {saving ? "Wait" : "Save"}
                        </button>
                        <button
                            className="ml-2 my-2 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-2 py-1 text-center mr-3 md:mr-0"
                            onClick={() => {
                                reset ? setReset(false) : setReset(true)
                                if (pathOrders.length > 0) {
                                    setEnd(false)
                                }
                            }
                            }>
                            Reset
                        </button>
                    </div>
                }
            </div>

        </div>
    </div>
}

export default CreatePath
