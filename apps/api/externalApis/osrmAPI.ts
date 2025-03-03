import axios from "axios";
import { LocationType, PathGeometryType, PathOrderType } from "types";

const url = 'http://router.project-osrm.org/route/v1/driving/';
const hosting_url ='http://66.70.190.180:5000/route/v1/driving/'

const urlDistanceMatrix = 'http://router.project-osrm.org/table/v1/driving/';
const hosting_urlDistanceMatrix ='http://66.70.190.180:5000/table/v1/driving/'


export const getGeometryApi= (startingLocation:LocationType, latLngs:{lat:number,lng:number}[])=>{
  
    // in Osrm documentation coordinates are added like [lng,lat] not [lat,lng]
    return new Promise<PathGeometryType>((resolve,reject)=>{
      
        let coordinatesString = latLngs.map(p => [p.lng,p.lat].join(',')).join(';');
          //add starting location
        coordinatesString = startingLocation.lng+","+startingLocation.lat+";"+coordinatesString
        // added started location , apart from nodes location
        axios.get(url+coordinatesString)
            .then(response => {
                console.log("OSRM",response.data.routes[0].geometry)
                resolve({geometry:response.data.routes[0].geometry,distanceInKm:response.data.routes[0].distance/1000,durationInMins:response.data.routes[0].duration/60})
             
            })
            .catch(async error => {
                // if first url fails then second
                console.log("error erro")
                try{
                    const response =await axios.get(url+coordinatesString)
                    console.log("hosting_url",response.data.routes[0].geometry)
                    resolve({geometry:response.data.routes[0].geometry,distanceInKm:response.data.routes[0].distance/1000,durationInMins:response.data.routes[0].duration/60})
                }
                catch(e){
                    reject(error)
                }
            });
    })
}

export const  getDistanceMatrixApi= (startingLocation:LocationType,latLngs:{lat:number,lng:number}[])=>{
  
    // in Osrm documentation coordinates are added like [lng,lat] not [lat,lng]
    return new Promise<number[][]>((resolve,reject)=>{
      
        let coordinatesString = latLngs.map(p => [p.lng,p.lat].join(',')).join(';');
          //add starting location
        coordinatesString = startingLocation.lng+","+startingLocation.lat+";"+coordinatesString
        axios.get(urlDistanceMatrix+coordinatesString+"?annotations=distance,duration")
            .then(response => {
                resolve(response.data.distances)
             
            })
            .catch(async error => {
                // if first url fails then second
                
                try{
                    const response =await axios.get(urlDistanceMatrix+coordinatesString)
                    resolve(response.data.distances)
                }
                catch(e){
                    reject(error)
                }
            });
    })
}





