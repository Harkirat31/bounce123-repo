import Image from "next/image"
import { FaArrowRight } from "react-icons/fa6"
import FeatureBox from "../components/home/feature_box"
import FeatureBoxDetailed from "../components/home/feature_box_detailed"
import { map_view_list, mobile_app_list, route_drawing_list } from "../constants/home_constants"

const Home = () => {
    return (    
        <div className="flex flex-col justify-start">
            <div className="flex flex-row justify-start items-center mt-2">
                <div className="w-1/2 text-primaryColor font-bold ">
                    <h1 className="text-6xl">Manage Your Deliveries with Confidence</h1>
                    <div className="mt-8 py-2 px-4 w-max h-max rounded-lg border-2 border-primaryColor flex flex-row items-center gap-x-4">
                        <span className="">Get Started</span>
                        <FaArrowRight />
                    </div>
                </div>
                <div className="w-1/2">
                    <div className="float-right w-[500px] aspect-[5/4] relative">
                        <Image className=" rounded-2xl" fill={true} objectFit="cover" src="/home/home_deliveries.jpg" alt="1"></Image>                    
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-between mt-16">

                <FeatureBox
                    heading="Map View"
                    summary="Populate deliveries over the map to get the visual representation of delivery orders at a glance">
                </FeatureBox>

                <FeatureBox
                    heading="Draw Routes"
                    summary="Draw paths or routes over the map to to segregate different delivery areas for drivers"
                ></FeatureBox>

                <FeatureBox
                    heading="Optimize Deliveries"
                    summary="Make more informed decision while assigning deliveries to the drivers"
                ></FeatureBox>

                <FeatureBox
                    heading="Drivers App"
                    summary="Mobile application for drivers to see and plan their schedule for the deliveries"
                ></FeatureBox>


                {/* <div className="relative w-[600px]  aspect-[2/1] border-2 rounded-md border-gray-600">
                    <Image fill={true} objectFit="cover" src="/home/2.png" alt="1"></Image>
                </div>
                <div className="relative w-[600px] aspect-[2/1]  border-2 rounded-md border-gray-600">
                    <Image fill={true} objectFit="cover" src="/home/3.png" alt="1"></Image>
                </div> */}
            </div>
            <div className="mt-20">
                <FeatureBoxDetailed
                    heading="Map View"
                    image="/home/2.png"
                    list={map_view_list}
                ></FeatureBoxDetailed>
            </div>

            <div className="mt-20">
                <FeatureBoxDetailed
                    heading="Draw Routes, Optimize deliveries"
                    image="/home/3.png"
                    list={route_drawing_list}
                    flip={true}
                ></FeatureBoxDetailed>
            </div>

            <div className="mt-20">
                <FeatureBoxDetailed
                    heading="Mobile App"
                    image="/home/mobile_app.png"
                    list={mobile_app_list}
                ></FeatureBoxDetailed>
            </div>

            <div className="mt-20">
                    
            </div>
        </div>
    
        
    )
}

export default Home
