import { useEffect, useRef, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { createPathAtom, orderSetForAtom, orderSetForPathCreation, savedPaths } from "../../store/atoms/pathAtom";
import { getOrderIds } from "../../store/selectors/orderSelector";
import { ordersAtom, ordersSearchDate } from "../../store/atoms/orderAtom";
import { createPath, getPathsAPI } from "../../services/ApiService";
import { userAtom } from "../../store/atoms/userAtom";
import { FaLongArrowAltDown } from "react-icons/fa";
import { AiFillDelete } from 'react-icons/ai';
import { convertToUTC } from "../../utils/UTCdate";


const CreatePath = ({ showCreatePath, setShowCreatePath }: {
    showCreatePath: { flag: boolean, toBeEditedPath: any },
    setShowCreatePath: React.Dispatch<React.SetStateAction<{
        flag: boolean;
        toBeEditedPath: any;
    }>>
}) => {
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const [pathOrders, setPathOrders] = useRecoilState(createPathAtom)
    const orderIds = useRecoilValue(getOrderIds)
    const orders = useRecoilValue(ordersAtom)
    const [dropDownValue, setDropDownValue] = useState<number | "Select">("Select")
    const [orderSetForPath, setorderSetForPath] = useRecoilState(orderSetForPathCreation)
    const [reset, setReset] = useState(false)
    const [_paths, setSavedPaths] = useRecoilState(savedPaths)
    const date = useRecoilValue(ordersSearchDate)
    const [saving, setSaving] = useState(false)
    const [selectdropdoenError, setSelectDropdownError] = useState(false)
    const user = useRecoilValue(userAtom)
    const [isEnd, setEnd] = useState(false)
    const changeCreatePathOrderSet = useSetRecoilState(orderSetForAtom)
    const saved = useRef(false) // weather path saved or not 



    useEffect(() => {
        setorderSetForPath([...orderIds] as string[])
        if (reset) {
            setPathOrders({ path: [], pathId: undefined })
            if (showCreatePath.toBeEditedPath) {
                showCreatePath.toBeEditedPath[1]({ ...showCreatePath.toBeEditedPath[0], show: true })
            }
            setShowCreatePath({ flag: true, toBeEditedPath: null })
        }
        return () => {

            if (showCreatePath.toBeEditedPath && !saved.current) {
                showCreatePath.toBeEditedPath[1]({ ...showCreatePath.toBeEditedPath[0], show: true })
            }
            setPathOrders({ path: [], pathId: undefined })
        }
    }, [date, reset])


    const getSrNoFororderId = (orderId: string) => {
        return orderIds.findIndex((x) => x === orderId) + 1
    }
    const getOrderNumberFororderId = (orderId: string) => {
        return orders.find((x) => x.orderId === orderId)?.orderNumber
    }

    const onSaveClick = () => {
        let newDate = convertToUTC(date)
        setSaving(true)
        createPath({ show: true, path: pathOrders.path, dateOfPath: newDate, pathId: pathOrders.pathId }).then((result) => {
            getPathsAPI(newDate).then((data: any) => {
                setSavedPaths([...data]);
                setSaving(false)
                saved.current = true
                if (showCreatePath.toBeEditedPath) {
                    let pathData = { ...showCreatePath.toBeEditedPath[0], show: true, path: pathOrders.path }
                    showCreatePath.toBeEditedPath[1](pathData)
                }
                setShowCreatePath({ toBeEditedPath: null, flag: false })
            }).catch(
                (err) => {
                    alert("Error Fetching Paths, Please Refresh the page")
                    setSaving(false)
                    setShowCreatePath({ toBeEditedPath: null, flag: false })
                })


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
        setPathOrders({ path: [...pathOrders.path, orderIds[dropDownValue - 1]!], pathId: pathOrders.pathId })
        let newSet = orderSetForPath.filter((orderId: any) => orderId != orderIds[dropDownValue - 1]!)
        changeCreatePathOrderSet([...newSet])
        if (newSet.length > 0) {
            setDropDownValue("Select")
        }

    }

    const onDropHandler = (ev: any) => {
        const data = ev.dataTransfer.getData("application/my-app");
        try {
            let startPosition = parseInt((ev.currentTarget).getAttribute('data-id'))
            let removedElementPosition = parseInt(data)
            if (startPosition == removedElementPosition) {
                ev.preventDefault();
            }
            let pathOrderCopy = [...pathOrders.path]
            let removedElement = pathOrderCopy[removedElementPosition]
            //let shiftStartElement = pathOrderCopy[startPosition]

            if (startPosition < removedElementPosition) {
                pathOrderCopy.splice(startPosition, 0, removedElement)
                pathOrderCopy.splice(removedElementPosition + 1, 1)
            } else {
                pathOrderCopy.splice(startPosition + 1, 0, removedElement)
                pathOrderCopy.splice(removedElementPosition, 1)
            }
            setPathOrders({ path: pathOrderCopy, pathId: pathOrders.pathId })
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

    const handleDeleteNode = (ev: any) => {
        try {
            let index = parseInt(ev.currentTarget.getAttribute('data-id-node'))
            let updatedPath = [...pathOrders.path]
            let deleteNodeValue = updatedPath[index]
            updatedPath.splice(index, 1)
            let updatedPathOrders = { path: updatedPath, pathId: pathOrders.pathId }
            setPathOrders(updatedPathOrders)
            //main atom of creating path has been updated
            changeCreatePathOrderSet([deleteNodeValue, ...orderSetForPath])
        }
        catch (error) {

        }

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
                    {(user && (pathOrders.path.length != 0 || orderSetForPath.length > 0)) &&
                        <div className="flex flex-col items-center pb-1">
                            <div className="flex flex-col items-center border-2 rounded-xl p-0.5 mb-1 ">
                                <p>Start</p>
                                <p className="underline" >{`${user.companyName} `}</p>
                            </div>
                            <FaLongArrowAltDown />
                        </div>}
                    {pathOrders.path.map((pathnode, index) => {
                        return (
                            <div className="flex flex-col items-center pb-1" >
                                <div data-id={`${index}`} id={`p${pathnode}`} onDragStart={onDragStartHandler} draggable="true" onDrop={onDropHandler} onDragOver={onDragOverHandler}
                                    className="flex flex-row items-center border-2 rounded-xl p-0.5">
                                    <p data-id={`${index}`} >{`Order`}</p>
                                    <p data-id={`${index}`} className="text-center px-2">
                                        {`Id. ${getOrderNumberFororderId(pathnode)}`}
                                    </p>
                                    <button data-id={`${index}`} data-id-node={`${index}`} onClick={handleDeleteNode} className="relative text-red-500"> <AiFillDelete /></button>
                                </div>
                                {<FaLongArrowAltDown />}
                            </div>
                        )
                    })}
                    {((orderSetForPath.length == 0 && pathOrders.path.length != 0) || isEnd) &&
                        <div className="flex flex-col items-center pb-1">
                            <div className="flex flex-col items-center border-2 rounded-xl p-0.5 mb-1 ">
                                <p>End</p>
                            </div>
                        </div>}
                </div>
                <div className="flex flex-row" >
                    {(orderSetForPath.length > 0 && !isEnd) &&
                        <div className="flex flex-row items-center">
                            <p>{`Add order at position ${pathOrders.path.length + 1} :`}</p>
                            <select ref={selectRef} value={dropDownValue} onChange={(event) => { setDropDownValue(parseInt(event.target.value)) }} className={`ml-2   ${selectdropdoenError ? "border-red-500 border-4" : "border-blue-900 border-2"}`} >
                                <option value="Select" >Select</option>
                                {orderSetForPath.map((orderId: any) => {
                                    return <>
                                        <option value={getSrNoFororderId(orderId!)}>{`Ord Id ${getOrderNumberFororderId(orderId!)}`}</option>
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
                                if (pathOrders.path.length > 0) {
                                    setEnd(true)
                                }
                            }
                            }
                                className="ml-2 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded px-2 py-1 text-center" >
                                End
                            </button>
                        </>}
                </div>

                {pathOrders.path.length > 0 &&
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
                                if (pathOrders.path.length > 0) {
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
