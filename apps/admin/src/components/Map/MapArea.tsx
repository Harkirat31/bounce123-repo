import { Wrapper } from "@googlemaps/react-wrapper";
import { API_KEY } from "../../../config";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getOrder, getOrderIds, getOrders } from "../../store/selectors/orderSelector";
import { OrderType, PathOrderType, UserType } from "types";
import { HIGH_PRIORITY_COLOR, LOW_PRIORITY_COLOR, MEDIUM_PRIORITY_COLOR, darkColors } from "../../utils/constants";
import { createPathAtom, getSavedPathById, savedPaths } from "../../store/atoms/pathAtom";
import { userAtom } from "../../store/atoms/userAtom";



/* Left Side of of the map page . Google maps API is integrated in this component to render orders and path data 
   Used React wrapper for google maps API
*/
const MapArea = ({ user }: { user: UserType }) => {
    return (
        <div>
            <div>
                <Wrapper apiKey={API_KEY} version="beta" libraries={["marker", "places"]}>
                    <MapComponent user={user}></MapComponent>
                </Wrapper>
            </div>
        </div>
    )
}

const MapComponent = ({ user }: { user: UserType }) => {
    const ref: any = useRef()
    const ordersIds = useRecoilValue(getOrderIds)
    const [map, setMap] = useState<any>()

    useEffect(() => {
        const mapOptions = {
            center: user?.location,
            zoom: 11,
            mapId: '4504f8b37365c3d0'
        };
        setMap(new window.google.maps.Map(ref.current, mapOptions,))
    }, []);

    return (
        <div ref={ref} id="map" className="h-screen" >
            {map && <div>
                <PickUpMarker map={map}></PickUpMarker>
                {ordersIds.map((orderId, index) => {
                    return <OrderMarker orderId={orderId!} srNo={index + 1} map={map}></OrderMarker>
                })}
                <CreatePolygonWhileCreatingPath map={map} user={user}></CreatePolygonWhileCreatingPath>
                <CreatePaths map={map} user={user}></CreatePaths>
            </div>}
        </div>
    );

}

const CreatePaths = ({ map, user }: { map: any, user: UserType }) => {
    const paths = useRecoilValue(savedPaths)
    const orders = useRecoilValue(getOrders)
    return <>
        {paths.map((pathElement, index) => {
            return <CreateSinglePath map={map} orders={orders} pathElement={pathElement} index={index} user={user}></CreateSinglePath>
        })}
    </>
}

const CreateSinglePath = ({ map, pathElement, orders, index, user }: { map: any, pathElement: PathOrderType, orders: OrderType[], index: number, user: UserType }) => {
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
            strokeColor: darkColors[index % darkColors.length],
            strokeOpacity: 1.0,
            strokeWeight: 2,
            icons: [{ icon: lineSymbol, offset: "100%", repeat: "20%" }]
        });
        if (pathData.path.length > 0) {
            let cordinates: any = [user?.location] //
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


const CreatePolygonWhileCreatingPath = ({ map, user }: { map: any, user: UserType }) => {
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
            let cordinates: any = [user?.location] //initialize the array of path with starting from comapany address
            createPathOrders.forEach((orderId) => {
                let order = orders.find((order) => order.orderId === orderId)
                cordinates.push(order?.location)
            })
            flightPath.setPath(cordinates)
            flightPath.setMap(map);
        }
        return () => {
            flightPath.setMap(null)
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
    const user = useRecoilValue(userAtom)
    useEffect(() => {
        const mapOptions = {
            center: user?.location,
            zoom: 11,
            mapId: '4504f8b37365c3d0'
        };

        const bounce123Info = document.createElement("div");

        bounce123Info.className = "home-tag";
        bounce123Info.textContent = user?.companyName ?? "ff";

        new window.google.maps.marker.AdvancedMarkerElement(
            {
                position: mapOptions.center,
                map: map,
                content: bounce123Info
                //label: srNo.toString()
            }
        )
    }, [user])
    return <>
    </>
}

function getInfoWindowContent(order: OrderType) {
    return `<p>Name : ${order.cname}</p>
    <p>Address : ${order.address}</p>
    <p>Status : ${order.currentStatus}</p>
    <p>Assigned To : ${order.driverName ? order.driverName : "No Driver Assigned"}</p>
    <p>Item Details : ${order.itemsDetail}</p>`
}

export default MapArea
