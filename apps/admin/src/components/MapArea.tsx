import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { API_KEY } from "../../config";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getOrders } from "../store/selectors/orderSelector";
import { OrderType } from "types";
import { getOrderById } from "../store/atoms/orderAtom";


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
    useEffect(() => {
        const pin = new window.google.maps.marker.PinElement({
            glyph: srNo.toString(),
            glyphColor: 'white',
        });

        const marker = new window.google.maps.marker.AdvancedMarkerElement(
            {
                position: orderData!.location,
                map: map,
                content: pin.element
                //label: srNo.toString()
            }
        )
        // let contentString = orderData!.driverName;
        // const InfoWindow = new window.google.maps.InfoWindow({
        //     content: contentString,
        //     ariaLabel: "Bounce123",
        // });
        // marker.addListener("click", () => {
        //     InfoWindow.open({
        //         anchor: marker,
        //         map
        //     })
        // })
        // InfoWindow.open({
        //     anchor: marker,
        //     map
        // })
        // return () => {
        //     marker.setMap(null)
        //     InfoWindow.close()
        // }
        return () => {
            // content.remove()
        }
    }, [orderData])

    return <></>
}

const PickUpMarker = ({ map }: any) => {
    useEffect(() => {
        new window.google.maps.Marker(
            {
                position: { lat: 43.6811345, lng: -79.58786719999999 },
                title: "Bounce123",
                map: map
            }
        )
    }, [])
    return <>
    </>
}

export default MapArea
