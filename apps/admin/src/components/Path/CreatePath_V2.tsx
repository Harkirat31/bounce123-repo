import { useEffect, useRef, useState } from "react"
import { SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { createPathAtom, orderSetForAtom, orderSetForPathCreation } from "../../store/atoms/pathAtom";
import { getOrderIds } from "../../store/selectors/orderSelector";
import { ordersAtom, ordersSearchDate } from "../../store/atoms/orderAtom";
import { createPath } from "../../services/ApiService";
import { userAtom } from "../../store/atoms/userAtom";
import { FaLongArrowAltDown } from "react-icons/fa";
import { AiFillDelete } from 'react-icons/ai';
import { convertToUTC } from "../../utils/UTCdate";
import { PathOrderType } from "types";
import { refreshData } from "../../store/atoms/refreshAtom";
import { GenerateOptimizedPaths } from "./GenerateOptimizedPaths";
import { MdDoneOutline } from "react-icons/md";
import { GiClick } from "react-icons/gi";
import { FaRoute } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";


export const CreatePathV2 = ({ showCreatePath, setShowCreatePath }: {
    showCreatePath: { flag: boolean, toBeEditedPath: [PathOrderType, SetterOrUpdater<PathOrderType | undefined>] | null },
    setShowCreatePath: React.Dispatch<React.SetStateAction<{
        flag: boolean;
        toBeEditedPath: any;
    }>>
}) => {

    const [pathOrders, setPathOrders] = useRecoilState(createPathAtom)
    const orderIds = useRecoilValue(getOrderIds)
    const orders = useRecoilValue(ordersAtom)
    const [orderSetForPath, setorderSetForPath] = useRecoilState(orderSetForPathCreation)
    const [reset, setReset] = useState(false)
    const date = useRecoilValue(ordersSearchDate)
    const [saving, setSaving] = useState(false)
    const user = useRecoilValue(userAtom)
    const changeCreatePathOrderSet = useSetRecoilState(orderSetForAtom)
    const saved = useRef(false) // weather path saved or not 

    const refreshAllData = useSetRecoilState(refreshData)

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
    }, [reset])


    const getLocationOfOrder = (orderId: string) => {
        return orders.find((x) => x.orderId === orderId)?.location
    }

    const getOrderNumberFororderId = (orderId: string) => {
        return orders.find((x) => x.orderId === orderId)?.orderNumber
    }

    const handleOrderClick = (id: string) => {
        setPathOrders({ path: [...pathOrders.path, { id: id, latlng: getLocationOfOrder(id) }], pathId: pathOrders.pathId })
        let newSet = orderSetForPath.filter((orderId: any) => orderId != id)
        changeCreatePathOrderSet([...newSet])

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

    const onSaveClick = () => {
        let newDate = convertToUTC(date)
        setSaving(true)
        // this method create path if path is undefined else update existing path

        //this can be changed if user after multiple location in future
        //if it is undefined , lat.lng:0,0
        //in future , we will make sure to have starting location of path
        const startingLocation = user?.location ?? { lat: 0, lng: 0 }
        createPath({ show: true, path: pathOrders.path, dateOfPath: newDate, pathId: pathOrders.pathId, startingLocation }).then((result) => {
            setSaving(false)
            saved.current = true
            setShowCreatePath({ toBeEditedPath: null, flag: false })

            //this will refresh whole data
            refreshAllData(Date.now().toString())

        }).catch((error) => {
            alert(error)
            setSaving(false)
        })

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
            changeCreatePathOrderSet([deleteNodeValue.id, ...orderSetForPath])
        }
        catch (error) {

        }
        
    }

    return <div className="border-2 flex flex-col items-center fixed top-[35%]  xl:top-20 xl:bottom-20  rounded-lg w-[100vw] h-[60vh]  xl:w-[20vw] xl:h-[80vh] bg-white">
        <FaWindowClose size={20} onClick={() => setShowCreatePath({ flag: false, toBeEditedPath: null })} className="absolute right-1 top-1 text-white hover:cursor-pointer"></FaWindowClose>
        <span className="text-center w-full mt py-2 bg-blue-700 text-white flex flex-row items-center justify-center"  >New Route <FaRoute className="ml-2"></FaRoute></span>
        <GenerateOptimizedPaths></GenerateOptimizedPaths>
        <div className="flex flex-wrap py-4 px-2 min-h-32 max-h-40 overflow-scroll border-b-2 w-full justify-center">
            {orderSetForPath.length > 0 && orderSetForPath.map((orderId: any) => {
                return <>
                    <div onClick={() => handleOrderClick(orderId)} className="m-1 p-1 w-10 text-center max-h-max bg-blue-700 text-white rounded">{getOrderNumberFororderId(orderId)}</div>
                </>
            })}
            {orderSetForPath.length == 0 && <div className="flex flex-row items-center p-2 bg-green-50 rounded text-black h-10">
                <MdDoneOutline />
                <p className="ml-1 ">All Added</p>
            </div>}


        </div>
       
        <div className="flex flex-col py-4 px-2 overflow-scroll w-full">
     
            <div className="flex flex-col items-center" >
         
                    
                <div className="mt-4 flex flex-col items-center justify-center">
                    
                    {pathOrders.path.length > 0 && (user && (pathOrders.path.length != 0 || orderSetForPath.length > 0)) &&
                        <div className="flex flex-col items-center pb-1">
                            <div className="bg-blue-700 text-white flex flex-row items-center border-2 rounded-xl p-2 mb-1 ">

                                <p className="underline" >{`${user.companyName} `}</p>
                            </div>
                        </div>}
                    
                    {pathOrders.path.length == 0 && <div className="flex flex-row items-center p-2 bg-green-50 rounded text-black">
                        <GiClick size={16} />
                        <p className="ml-1 text-sm ">Click orders in Sequence</p>
                    </div>}
                    {pathOrders.path.map((pathnode, index) => {
                        return (
                            <div className="flex flex-col items-center pb-1 " >
                                {<FaLongArrowAltDown />}
                                <div data-id={`${index}`} id={`p${pathnode}`} onDragStart={onDragStartHandler} draggable="true" onDrop={onDropHandler} onDragOver={onDragOverHandler}
                                    className="flex flex-row items-center border-2 rounded-xl p-0.5 bg-blue-700 text-white">
                                    <p data-id={`${index}`} >{`Order`}</p>
                                    <p data-id={`${index}`} className="text-center px-2">
                                        {`Id. ${getOrderNumberFororderId(pathnode.id)}`}
                                    </p>
                                    <button data-id={`${index}`} data-id-node={`${index}`} onClick={handleDeleteNode} className="relative text-red-500"> <AiFillDelete /></button>
                                </div>

                            </div>
                        )
                    })}

                </div>
                <div className="flex flex-row" >



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
