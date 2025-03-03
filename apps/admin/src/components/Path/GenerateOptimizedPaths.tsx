import { useRecoilValue, useSetRecoilState } from "recoil"
import { loadingState } from "../../store/atoms/loadingStateAtom"
import { ordersSearchDate } from "../../store/atoms/orderAtom"
import { convertToUTC } from "../../utils/UTCdate"
import { userAtom } from "../../store/atoms/userAtom"
import { getOrdersForGeneratingOptimizedPaths } from "../../store/atoms/pathAtom"
import { generateOptomizePathsAPI } from "../../services/ApiService"
import { refreshData } from "../../store/atoms/refreshAtom"
import { useRef, useState } from "react"

export const GenerateOptimizedPaths = () => {
    const setLoading = useSetRecoilState(loadingState)
    const date = useRecoilValue(ordersSearchDate)
    const user = useRecoilValue(userAtom)
    const orders = useRecoilValue(getOrdersForGeneratingOptimizedPaths)
    const refreshAllData = useSetRecoilState(refreshData)

    const [numberOfPaths, setNumberOfPaths] = useState(0);
    const [isOpen, setIsOpen] = useState(false)
    const divRef = useRef<HTMLDivElement | null>(null);
    const [errorMessage,setErrorMessage] = useState("")



    const clickButton = () => {
        setIsOpen(true)
    }

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrorMessage("")
        const divElement = divRef.current;
        let totalPendingDeliveries = 0
        let newDate = convertToUTC(date)
        const startingLocation = user?.location ?? { lat: 0, lng: 0 }
        const orderIdsWithLocation = orders.map(
            order => ({ id: order.orderId!, latlng: order.location! })
        )
        if(divElement==null){
            return
        }
        // Retrieve input elements inside the div
        const inputElements = divElement.querySelectorAll("input");

      
        const capacityArray:number[] = []
        Array.from(inputElements).forEach((input) => {
            totalPendingDeliveries =totalPendingDeliveries + Number.parseInt(input.value)
            capacityArray.push(Number.parseInt(input.value))
        });
       
        const demands = orders.map((e)=> 1)
        demands.unshift(0)

        if(capacityArray.length>0 && numberOfPaths>0 && demands.length>1){
            setLoading({isLoading:true,value:"Generating Routes. Please Wait...."})
            generateOptomizePathsAPI({ date:newDate , orderIdsWithLocation: orderIdsWithLocation, startingLocation: startingLocation, numberOfVehicles: numberOfPaths, demands, vehicleCapacity: capacityArray }).then((result: any) => {
                if (result.isCreated) {
                    refreshAllData(Date.now().toString())
                }
                else{
                    setLoading({isLoading:false,value:null})
                    
                    if(result.msg){
                        setErrorMessage(result.msg)
                    }
                   // setIsOpen(false)
                }
                setLoading({isLoading:false,value:null})
            }).catch((error) => {   
                alert(error)
                setLoading({isLoading:false,value:null})
                setIsOpen(false)
            })
        }

    }

    return <div className="relative">
        <button className="p-1 text-white bg-blue-700 hover:bg-blue-800 rounded-md" onClick={clickButton}>Generate Optimized Routes</button>
        <div className={` fixed flex flex-col w-screen h-screen top-0 left-0 transition-all duration-75 ${isOpen ? "scale-100" : "scale-0"}`}>
            <div className={`relative bg-black  bg-opacity-80 flex flex-row justify-center items-center h-screen`}>
             
                    <div className="relative w-[90%] md:w-2/3 min-h-[300px]  bg-white rounded-lg px-1">
                    <form onSubmit={submitForm} >
                        <div className="absolute right-0 top-0">
                            <p onClick={() => setIsOpen(false)} className="text-red-600 text-lg font-bold pr-2 hover:cursor-pointer">Close</p>
                        </div>
                        <div className="w-full p-2 border-b-2">
                            <h2 className="text-center text-2xl"> Generate Optimized Path Automatically</h2>
                        </div>
                        <div className="mt-5">
                            <label>Number of Paths to be created </label>
                            <input value={numberOfPaths} onChange={(e) => setNumberOfPaths(Number.parseInt(e.target.value))} className="border p-1 ml-2" type="number"></input>
                        </div>
                        {numberOfPaths > 0 && <div ref={divRef} className="mt-2">
                           <p>Pending Deliveries to be assigned to any path : {orders.length} </p>
                            <label>Enter no. of deliveries for each path</label>
                            {Array.from({ length: numberOfPaths }).map(() => {
                                return <>
                                    <input required className="border mx-1" type="number"></input>
                                </>
                            })}
                        </div>}

                        <button className="border bg-blue-700" type="submit">Generate</button>
                        {errorMessage.length>0}{
                            <p className="text-red-500 mt-5 font-bold">{"ERROR : "+errorMessage}</p>
                        }


                        </form>
                    </div>
              
            </div>
        </div>
    </div>
}