import axios from "axios";
const VRP_SERVICE_URL = "http://localhost:8080/api/vrp/optimize"


export const getOptimizeRoutes = (distanceMatrix:number[][],orderIds:string[],numberOfVehicles:number,demands:number[],vehicleCapacity:number[ ])=>{
    return new Promise<string[][]>(async (resolve,reject)=>{
        try{
            const response =  await axios.post(VRP_SERVICE_URL,{
                distanceMatrix,
                orderIds,
                numberOfVehicles,
                demands,
                vehicleCapacity

            },
            {
                timeout:20000
            }
        )
            const data = response.data
            const paths = data.paths
            resolve(paths)
        }
        catch(error){
            reject("Error")
        }
      
    })
}