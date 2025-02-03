import axios from "axios";
import { PathGeometryType, PathOrderType } from "types";

const url = 'http://router.project-osrm.org/route/v1/driving/';

const hosting_url ='http://66.70.190.180:5000/route/v1/driving/'

export const getGeometryApi= (path:PathOrderType)=>{
  
    // in Osrm documentation coordinates are added like [lng,lat] not [lat,lng]
    return new Promise<PathGeometryType>((resolve,reject)=>{
      
        let coordinatesString = path.path.map(p => [p.latlng?.lng,p.latlng?.lat].join(',')).join(';');
          //add starting location
        coordinatesString = path.startingLocation.lng+","+path.startingLocation.lat+";"+coordinatesString
        // added started location , apart from nodes location
        axios.get(hosting_url+coordinatesString)
            .then(response => {
                console.log("OSRM_Hosted",response.data.routes[0].geometry)
                resolve({geometry:response.data.routes[0].geometry,distanceInKm:response.data.routes[0].distance/1000,durationInMins:response.data.routes[0].duration/60})
             
            })
            .catch(async error => {
                // if first url fails then second
                console.log("error erro")
                try{
                    const response =await axios.get(url+coordinatesString)
                    console.log("Osrm",response.data.routes[0].geometry)
                    resolve({geometry:response.data.routes[0].geometry,distanceInKm:response.data.routes[0].distance/1000,durationInMins:response.data.routes[0].duration/60})
                }
                catch(e){
                    reject(error)
                }
            });
    })
}




