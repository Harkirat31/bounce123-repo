import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { API_KEY } from "../../config";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getOrders } from "../store/selectors/orderSelector";
import { OrderType } from "types";
import { getOrderById } from "../store/atoms/orderAtom";
import { HIGH_PRIORITY_COLOR, LOW_PRIORITY_COLOR, MEDIUM_PRIORITY_COLOR } from "../utils/constants";


const mapOptions = {
    center: { lat: 43.6811345, lng: -79.58786719999999 },
    zoom: 11,
    mapId: '4504f8b37365c3d0'
};

const MapArea = () => {
    return (
        <div>
            <div className='map_main'>
                <Wrapper apiKey={API_KEY} version="beta" libraries={["marker"]}>
                    <MapComponent></MapComponent>
                </Wrapper>
            </div>
        </div>
    )
}

const MapComponent = () => {
    const ref: any = useRef();
    const orders = useRecoilValue(getOrders)
    const [map, setMap] = useState<any>()

    useEffect(() => {
        setMap(new window.google.maps.Map(ref.current, mapOptions,))
    }, []);

    return (
        <div ref={ref} id="map" className="h-screen" >
            {map && <div>
                <PickUpMarker map={map}></PickUpMarker>
                {orders.map((order, index) => {
                    return <OrderMarker order={order} srNo={index + 1} map={map}></OrderMarker>
                })}
            </div>}
        </div>
    );

}

const OrderMarker = ({ order, map, srNo }: { order: OrderType, map: any, srNo: number }) => {
    const [orderData, setOrderData] = useRecoilState(getOrderById(order.orderId!))
    const [isOpenOnMap, setIsOpenOnMap] = useState(false)
    useEffect(() => {
        const pin = new window.google.maps.marker.PinElement({
            glyph: srNo.toString(),
            glyphColor: 'white',
            background: orderData?.priority === "High" ? HIGH_PRIORITY_COLOR : orderData?.priority === "Medium" ? MEDIUM_PRIORITY_COLOR : LOW_PRIORITY_COLOR,
            borderColor: "DarkSlateGrey"
        });

        const marker = new window.google.maps.marker.AdvancedMarkerElement(
            {
                position: orderData!.location,
                map: map,
                content: pin.element
                //label: srNo.toString()
            }
        )
        let contentString = getInfoWindowContent(orderData!);
        const InfoWindow = new window.google.maps.InfoWindow({
            content: contentString,
            ariaLabel: "Bounce123",
        });


        marker.addListener("click", () => {
            setIsOpenOnMap(true)
            InfoWindow.open({
                anchor: marker,
                map
            })
        })
        if (isOpenOnMap) {
            InfoWindow.open({
                anchor: marker,
                map
            })
        }
        return () => {
            marker.map = null
            InfoWindow.close()
        }

    }, [orderData])

    return <></>
}

const PickUpMarker = ({ map }: any) => {
    useEffect(() => {
        const pin = new window.google.maps.marker.PinElement({
            glyphColor: 'white',
            scale: 1.5,
            background: 'green',
            borderColor: 'green'
        });

        const bounce123Info = document.createElement("div");

        bounce123Info.className = "home-tag";
        bounce123Info.textContent = "Bounce 123";

        new window.google.maps.marker.AdvancedMarkerElement(
            {
                position: mapOptions.center,
                map: map,
                content: bounce123Info
                //label: srNo.toString()
            }
        )
    }, [])
    return <>
    </>
}



function getInfoWindowContent(order: OrderType) {
    let rentingItems = ''
    order.rentingItems.forEach((item) => {
        rentingItems = rentingItems + item.rentingItemTitle
    })
    let extraItems = ''
    if (order.extraItems) {
        order.extraItems.forEach((item) => {
            extraItems = extraItems + item.sideItemTitle
        })
    }
    return `<p>Name : ${order.cname}</p>
    <p>Address : ${order.address}</p>
    <p>Status : ${order.currentStatus}</p>
    <p>Assigned To : ${order.driverName ? order.driverName : "No Driver Assigned"}</p>
    <p>Rent Items : ${rentingItems} </p>
    <p>Extra Items : ${extraItems === '' ? "No Extra Items" : extraItems} </p>`
}

export default MapArea
