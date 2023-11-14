import { Wrapper } from "@googlemaps/react-wrapper";
import { API_KEY } from "../../config";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getOrder, getOrderIds, getOrders } from "../store/selectors/orderSelector";
import { OrderType, PathOrderType } from "types";
import { HIGH_PRIORITY_COLOR, LOW_PRIORITY_COLOR, MEDIUM_PRIORITY_COLOR } from "../utils/constants";
import { createPathAtom, getSavedPathById, savedPaths } from "../store/atoms/pathAtom";


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
    const ref: any = useRef()
    const ordersIds = useRecoilValue(getOrderIds)
    const [map, setMap] = useState<any>()

    useEffect(() => {
        setMap(new window.google.maps.Map(ref.current, mapOptions,))
    }, []);

    return (
        <div ref={ref} id="map" className="h-screen" >
            {map && <div>
                <PickUpMarker map={map}></PickUpMarker>
                {ordersIds.map((orderId, index) => {
                    return <OrderMarker orderId={orderId!} srNo={index + 1} map={map}></OrderMarker>
                })}
                <CreatePolygonWhileCreatingPath map={map}></CreatePolygonWhileCreatingPath>
                <CreatePaths map={map}></CreatePaths>
            </div>}
        </div>
    );

}

const CreatePaths = ({ map }: { map: any }) => {
    const paths = useRecoilValue(savedPaths)
    const orders = useRecoilValue(getOrders)
    return <>
        {paths.map((pathElement) => {
            return <CreateSinglePath map={map} orders={orders} pathElement={pathElement} ></CreateSinglePath>
        })}
    </>
}

const CreateSinglePath = ({ map, pathElement, orders }: { map: any, pathElement: PathOrderType, orders: OrderType[] }) => {
    const pathData = useRecoilValue(getSavedPathById(pathElement.pathId!))
    useEffect(() => {
        if (!pathData)
            return
        if (!pathData.show)
            return
        var lineSymbol = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,

        };
        let flightPath = new window.google.maps.Polyline({
            geodesic: true,
            strokeColor: "Green",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            icons: [{ icon: lineSymbol, offset: "100%", repeat: "20%" }]
        });
        if (pathData.path.length > 0) {
            let cordinates: any = [{ lat: 43.6811345, lng: -79.58786719999999 }]
            pathData.path.forEach((orderId) => {
                let order = orders.find((order) => order.orderId === orderId)
                cordinates.push(order?.location)
            })
            flightPath.setPath(cordinates)
            flightPath.setMap(map);
        }
        return () => {
            flightPath.setMap(null)
        }

    }, [pathData])
    return <></>
}


const CreatePolygonWhileCreatingPath = ({ map }: { map: any }) => {
    const createPathOrders = useRecoilValue(createPathAtom)
    const orders = useRecoilValue(getOrders)
    useEffect(() => {
        var lineSymbol = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        };
        let flightPath = new window.google.maps.Polyline({
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            icons: [{ icon: lineSymbol, offset: "100%", }]
        });
        if (createPathOrders.length > 0) {
            let cordinates: any = [{ lat: 43.6811345, lng: -79.58786719999999 }]
            createPathOrders.forEach((orderId) => {
                let order = orders.find((order) => order.orderId === orderId)
                cordinates.push(order?.location)
            })
            flightPath.setPath(cordinates)
            flightPath.setMap(map);
        }
        return () => {
            flightPath.setMap(null)
            console.log("Map Area")
        }

    }, [createPathOrders])
    return <>
    </>
}


const OrderMarker = ({ orderId, map, srNo }: { orderId: string, map: any, srNo: number }) => {
    const [orderData, _setOrderData] = useRecoilState(getOrder(orderId))
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
