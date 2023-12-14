import { useEffect, useRef, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { createPathAtom, orderSetForPathCreation, savedPaths } from "../../store/atoms/pathAtom";
import { getOrderIds } from "../../store/selectors/orderSelector";
import { ordersSearchDate } from "../../store/atoms/orderAtom";
import { createPath, getPathsAPI } from "../../services/ApiService";



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

    return <div className="flex flex-col items-center">
        <div className="mx-2 mt-2 flex flex-col justify-center items-center">
            {orderSetForPath.length == 0 &&
                <div className="h-full">
                    <p> All Orders have been added to paths</p>
                    <p> Or No order is created for this date!!</p>
                </div>
            }
            <div className="flex flex-row" >

                {orderSetForPath.length > 0 &&
                    <div className="flex flex-row">
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

                {orderSetForPath.length > 0 && <button onClick={
                    () => {
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
                } className="ml-2 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded px-2 py-1 text-center" >
                    Add
                </button>}
            </div>

            <div >
                <div className="mt-4 grid grid-cols-8 items-center justify-center">
                    {pathOrders.map((pathnode) => {
                        return <>
                            <p className="text-center w-6 h-6 m-0.5 text-black bg-red-400 border-gray-300 rounded-xl">
                                {getSrNoFororderId(pathnode)}
                            </p>
                        </>
                    })}
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
                            onClick={() => { reset ? setReset(false) : setReset(true) }}>
                            Reset
                        </button>
                    </div>
                }
            </div>

        </div>
    </div>
}

export default CreatePath
