import { useEffect, useState } from "react";
import { AiFillNotification } from "react-icons/ai";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { updateOrderStatusToDelivered } from "../../store/selectors/orderSelector";
import { realTimeUpdates } from "../../store/atoms/updatesAtom";
import { webSocket } from "../../store/atoms/webSocket";
import { ordersAtom } from "../../store/atoms/orderAtom";
import { RealTimeUpdates } from "types";
import { savedPathsAtom } from "../../store/atoms/pathAtom";

export const LiveUpdates = () => {
    const [isOpen,setIsOpen] = useState<boolean>(false)
    const updateStatusToDelivered = useSetRecoilState(updateOrderStatusToDelivered)
    const socket = useRecoilValue(webSocket)
    const orders = useRecoilValue(ordersAtom)
    const paths = useRecoilValue(savedPathsAtom)

    const [messages,setMessages] = useRecoilState(realTimeUpdates)
    
    
// THIS BIG Problem should be understood
// setMessages([...messages, { message: `${order!.driverName} has delivered the order number ${order?.orderNumber}`, timeStamp: new Date() }])
//    When the handleDeliveryUpdateMessage function is created (inside the LiveUpdates component), it captures the initial value of messages at the time of its creation. This happens because JavaScript closures "remember" the environment in which they were created, including any variables like messages.
// // Even though the LiveUpdates component might re-render and messages might update with new values, the handleDeliveryUpdateMessage function is still holding on to the initial value of messages from the very first render. This is because the function is referencing the old state due to how closures work, and not the latest state that the component has after re-renders.
    const handleDeliveryUpdateMessage = (event:MessageEvent)=>{
        const data = JSON.parse(event.data)
        if (data.type && data.type == RealTimeUpdates.ORDER_DELIVERED) {
            const order = orders.find((o)=>o.orderId==data.id)
            if(order){
                updateStatusToDelivered(order?.orderId!)
                // setMessages([...messages, { message: `${order!.driverName} has delivered the order number ${order?.orderNumber}`, timeStamp: new Date() }])
                 setMessages((prevMessages) => [
                     { message: `${order!.driverName} has delivered the order number ${order?.orderNumber}`, timeStamp: new Date() },...prevMessages,
                 ]);
            }else{
                setMessages((prevMessages) => [
                    { message: `Order has been Delivered`, timeStamp: new Date() },...prevMessages,
                ]);
            }    
        }
        if (data.type && data.type == RealTimeUpdates.PATH_ACCEPTED) {
            const path = paths.find((p)=>p.pathId==data.id)
            if(path){
              //  updateStatusToDelivered(order?.orderId!)
                // setMessages([...messages, { message: `${order!.driverName} has delivered the order number ${order?.orderNumber}`, timeStamp: new Date() }])
                 setMessages((prevMessages) => [
                     { message: `${path!.driverName} has ${data.isAccepted?"accepted":"Rejected"} the assigned deliveries route`, timeStamp: new Date() },...prevMessages,
                 ]);
            }else{
                setMessages((prevMessages) => [
                    { message: `One Driver has ${data.isAccepted?"accepted":"rejected"} the path`, timeStamp: new Date() },...prevMessages,
                ]);
            }    
        }

    }
    useEffect(()=>{  
        if(socket){    
            socket.addEventListener("message", handleDeliveryUpdateMessage)
        }  
        return ()=>{
            if(socket){
                socket.removeEventListener("message",handleDeliveryUpdateMessage)
            } 
        }
    },[socket])

    return <>
        <div className="w-full">
            <div className={`flex flex-row justify-between pl-2 lg:pl-16`}>
                {messages.length>0 && !isOpen?<div className="flex flex-row items-center text-xs md:text-base"><p>{messages[0].timeStamp.toLocaleTimeString()+": "+messages[0].message}</p><p className="text-red-500 font-bold italic pl-1 md:pl-2 animate-pulse">New</p></div>:<p></p>}
                <div className="flex flex-row justify-end items-center pr-2 gap-x-2 ">
                {!isOpen && <MdKeyboardArrowDown onClick={()=>isOpen?setIsOpen(false):setIsOpen(true)} className="text-3xl hover:cursor-pointer" />}
                {isOpen &&<MdKeyboardArrowUp onClick={()=>isOpen?setIsOpen(false):setIsOpen(true)} className="text-3xl hover:cursor-pointer" />}
                <p className="font-bold text-sm md:text-base ">Live Updates</p>
                <AiFillNotification id="notification" className="text-red-500 animate-pulse"></AiFillNotification>
                </div>
            </div>
            <div className={`pl-1 sm:pl-16 z-10 w-full bg-white transition-all duration-500 overflow-auto custom-scrollbar ${isOpen?"h-40":"h-0"}`}>
                {messages.length>0 &&
                    messages.map((message)=>{
                        return <>
                        <p>{message.timeStamp.toLocaleTimeString()+": "+message.message}</p>
                        
                        </>
                       
                    })
                }
            </div>
        </div>
    </>
}