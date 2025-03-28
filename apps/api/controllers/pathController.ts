import { Request, Response } from "express"
import { getDistanceMatrixApi, getGeometryApi } from "../externalApis/osrmAPI"
import { getOptimizeRoutes } from "../externalApis/vrpAPI"
import { generatingOptimizePathsParams } from "types"
import { createPath } from "mongoose-db"

export const generateOptimizeRoutes = async (req: Request, res: Response) => {

    req.body.date = new Date(req.body.date)
    const params = generatingOptimizePathsParams.safeParse(req.body)

    if (!params.success) {
        return res.status(400).json({
            isCreated: false,
            msg: "Error in Parameters"
        })
    }
    const locations = params.data.orderIdsWithLocation.map((o) => o.latlng)
    const orderIds = params.data.orderIdsWithLocation.map((o) => o.id)
    const numberOfVehicles = params.data.numberOfVehicles
    const demands = params.data.demands;
    const vehicleCapacity = params.data.vehicleCapacity

    const totalVehiclesDemand = vehicleCapacity.reduce((acc, curr) => acc += curr, 0)
    if (totalVehiclesDemand)
        if (totalVehiclesDemand != orderIds.length) {
            return res.status(400).json({
                isCreated: false,
                msg: "Total Deliveries of the vehicles are not equal to pending Deliveries."
            })
        }
    //converting orderIdsWithLoction to hashmap 
    const hashMap = new Map<string, {
        id: string;
        latlng: {
            lat: number;
            lng: number;
        };
    }>()

    params.data.orderIdsWithLocation.forEach((element) => {
        hashMap.set(element.id, element)
    })
    try {
        const distanceMatrix = await getDistanceMatrixApi(params.data.startingLocation, locations)

        //this is done so drivers do not return to depot
        for (const row of distanceMatrix) {
            row[0] = 0
        }
        const paths = await getOptimizeRoutes(distanceMatrix, orderIds, numberOfVehicles, demands, vehicleCapacity)
        for (const path of paths) {
            if (path.length == 0) {
                continue
            }
            const pathsLocation = path.map((e) => hashMap.get(e)!.latlng)
            let pathGeometry = undefined
            try {
                pathGeometry = await getGeometryApi(params.data.startingLocation, pathsLocation)
            }
            catch (e) {
                // delete parsedData.data.pathGeometry 
                console.log(e)
                //log  when not error in getGeometryApi
            }
            const pathWithIdAndLocation = path.map((e) => hashMap.get(e)!)
            await createPath({ dateOfPath: params.data.date, path: pathWithIdAndLocation, show: true, startingLocation: params.data.startingLocation, companyId: req.body.companyId, pathGeometry: pathGeometry })
        }

        res.json({
            isCreated: true,
            msg: "Error"
        })
    }
    catch (error: any) {
        if (error.response && error.response.data && error.response.data.code) {
            if (error.response.data.code == "TooBig") {
                return res.status(400).json({
                    isCreated: false,
                    msg: "Delivery locations can not be more than 100"
                })
            }else{
                return res.status(400).json({
                    isCreated: false,
                    msg: error.response.data.code 
                })
            }
        }
        else{
            return res.status(400).json({
                isCreated: false,
                msg: error
            })
        }
    }
}