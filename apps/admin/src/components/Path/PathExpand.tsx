import { useState } from "react";
import { TbListDetails } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { CgDetailsMore } from "react-icons/cg";
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";





export const PathExpand = () => {
    const [open, setOpen] = useState(false)
    return <>
        <div onClick={() => {
            setOpen(true)
        }} className="relative">
            <TbListDetails className="text-black mt-2" />
        </div>
        {open &&
            <div className="fixed  w-svw  h-72 left-0 bottom-0 flex flex-col items-center justify-center bg-gray-200 bg-opacity-90 z-50">
                <div className="relative w-full">
                    <div className="absolute -top-10 right-0">
                        <button onClick={() => setOpen(false)} className="text-red-700 text-lg font-bold">Close</button>
                    </div>
                </div>
                <div className="rounded-lg h-56 bg-white  w-[90%] p-4 flex flex-col text-black">
                    <div className="flex flex-row gap-x-4">
                        <p>Distance : 34Km</p>
                        <p>Estimated Time Required: 34 mins </p>
                        <p>Sent to HArkirat Or Not Assigned </p>
                    </div>

                    <div className="flex flex-row">
                        <div className="flex flex-col border-gray-500 border rounded-md p-2 mr-2 items-start gap-y-1 mt-2 w-64 h-44 overflow-scroll text-xs">
                            
                            <div className="flex flex-row items-center gap-x-2 border-b w-full">
                                <p className="text-blue-600">Ord Id. </p>
                                <p>1</p>
                            </div>

                            <div className="flex flex-row items-center gap-x-2 border-b w-full">
                                <p className="text-blue-600">Priority</p>
                                <p>Medium</p>
                            </div>
                            
                            <div className="flex flex-row items-center gap-x-2  border-b w-full">
                                <p className="text-blue-600">C Name.</p>
                                <p>Harkriat Singh</p>
                            </div>
                            
                            <div className="flex flex-row  gap-x-2 border-b w-full">
                                <p className="text-blue-600 ">Instruction.</p>
                                <p className="text-left">Early delivery before 10 am </p>
                            </div>
                    
                             <div className="flex flex-row  gap-x-2  border-b w-full">
                                <CgDetailsMore className="text-blue-600"/>
                                <p className="text-left">Animal Kingdom, Tropical 2 slide etc</p>
                            </div>
                            <div className="flex flex-row items-center gap-x-2  border-b w-full">
                                <FaLocationDot className="text-blue-600 "/>
                                <p>20 Major Oaks Dr</p>
                            </div>
                            <div className="flex flex-row items-center gap-x-2  border-b w-full">
                                <FaPhone className="text-blue-600"/>
                                <p>437-986-4033</p>
                            </div>
                            
                             <div className="flex flex-row items-center gap-x-2  border-b w-full">
                                <MdEmail className="text-blue-600"/>
                                <p>harkiratsingh.tu@gmail.com</p>
                            </div>
                            

                        </div>
                    </div>

                </div>
            </div>
        }

    </>
}   