import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { API_KEY } from "../../config";
import { useEffect, useRef } from "react";

const MapArea = () => {
    console.log("Map Area Loaded")
    const center: { lat: number, lng: number } = { lat: 43.6811345, lng: -79.58786719999999 };
    const zoom: number = 11;
    const render: any = (status: any) => {
        switch (status) {
            case Status.LOADING:
                return <h1>Wait.....</h1>;
            case Status.FAILURE:
                return <h1>Error.....</h1>;
            case Status.SUCCESS:
                return <MapComponent center={center} zoom={zoom} />;
        }
    };
    return (
        <div>
            <div className='map_main'>
                <Wrapper apiKey={API_KEY} render={render} >
                </Wrapper>
            </div>
        </div>
    )
}

const MapComponent = (props: { center: { lat: number, lng: number }, zoom: number }) => {
    const ref: any = useRef();

    useEffect(() => {

        const map = new google.maps.Map(ref.current, { center: props.center, zoom: props.zoom });
        const contentString = "Bounce 123";
        const headQuarterInfoWindow = new window.google.maps.InfoWindow({
            content: contentString,
            ariaLabel: "Bounce123",
        });
        let headquarters = new window.google.maps.Marker({
            position: { lat: 43.6811345, lng: -79.58786719999999 },
            title: "Bounce123",
        });
        headquarters.setMap(map)
        headQuarterInfoWindow.open({
            anchor: headquarters,
            map,
        });
    }, []);

    return (
        <div ref={ref} id="map" className="h-screen" >

        </div>
    );
}

export default MapArea
