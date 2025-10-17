import { Request, Response } from "express"
import { getDistanceMatrixApi, getGeometryApi } from "../externalApis/osrmAPI"
import { getOptimizeRoutes } from "../externalApis/vrpAPI"
import { ErrorCode, generatingOptimizePathsParams, pathOrder } from "types"
import { assignOrderAndPath, assignPathToDriver, cancelPath, createPath, deletePath, getOrdersWithPathId, getPathswithDate, updatePath, updatePathGemetry, getDriverPathsReport, getAssignedPathsWithOrders } from "mongoose-db"
import { getDriver, getUser, sendNotification } from "db"
import { sendTextMessage } from "../services/text_message/text_message_service"



export const deletePathController = (req: Request, res: Response) => {
  req.body.dateOfPath = new Date(req.body.dateOfPath)
  let parsedData = pathOrder.safeParse(req.body)
  if (!parsedData.success) {
    return res.status(403).json({
      err: ErrorCode.WrongInputs
    });
  }
  deletePath(parsedData.data).then((result) => {
    res.json({ isDeleted: true });
  }).catch((error) => res.json({ err: error }))
}


export const getPathsController  = (req: Request, res: Response) => {
  let parsedDate = req.body.date
  if (!parsedDate) {
    return res.status(400).json({
      err: ErrorCode.WrongInputs
    });
  }
  getPathswithDate(new Date(parsedDate), req.body.companyId).then((paths) => {
    res.json(paths);
  }).catch(() => {
    res.status(403).json({
      err: ErrorCode.DbError
    })
  })
}


export const cancelPathController = (req: Request, res: Response) => {
    if (req.body.dateOfPath) {
      try {
        req.body.dateOfPath = new Date(req.body.dateOfPath)
      }
      catch (_error) {
        return res.status(400).json({
          isAdded: false,
          msg: "Error in Parameters"
        })
      }
    }
    let assignPathParams = pathOrder.safeParse(req.body)
  
    if (!assignPathParams.success) {
      console.log(assignPathParams.error)
      return res.status(403).json({
        isCancelled: false,
        msg: "Error in Parameters"
      })
    }
  
   
    cancelPath(assignPathParams.data).then(async (result) => {
  
      //update geometry of new Path
      if(!result.isPathDeleted && result.modifiedPath && result.modifiedPath.length>0){
        try{
            const pathGeometry = await getGeometryApi(assignPathParams.data.startingLocation,result.modifiedPath.map(p=>p.latlng!))
            assignPathParams.data.pathGeometry = pathGeometry
          }
          catch(e){
           // console.log(e)
          }
          await updatePathGemetry(assignPathParams.data)
      }
       res.json({ isCancelled: result, isPathDeleted: result.isPathDeleted, modifiedPath: result.modifiedPath })
    }).catch((error) => {
      res.json({ isCancelled: false, isPathDeleted: false })
    })
}

export const assignOrderAndPathController = async (req: Request, res: Response) => {
  req.body.dateOfPath = new Date(req.body.dateOfPath)
  let parsedData = pathOrder.safeParse(req.body)
  let driverId: string | undefined;
  if (!parsedData.success) {
    console.log(parsedData.error)
    return res.status(403).json({
      msg: "Error in  Details"
    });
  }
  driverId = parsedData.data.driverId
  try{
    const pathGeometry = await getGeometryApi(parsedData.data.startingLocation,parsedData.data.path.map(o=>o.latlng!))
    parsedData.data.pathGeometry = pathGeometry
    console.log(pathGeometry)
  }
  catch(e){
   // delete parsedData.data.pathGeometry 
    console.log(e)
    //log  when not error in getGeometryApi
  }
  if (parsedData.data.pathId) {

    //create path geomatry to be rendered om map
    //const directionsResult  = await axios.get()
    updatePath(parsedData.data).then((result) => {
      res.json({ isAdded: true });
    }).catch((error) => res.json({ isAdded: false }))
  }
  else {
    assignOrderAndPath(parsedData.data).then(async (result: any) => {
      //sending mesage
      let orders = await getOrdersWithPathId(result.pathId)
      let driver = await getDriver(driverId!, req.body.companyId)
      let company = await getUser(driver.companyId!)
      let message = `Orders for ${req.body.dateOfPath.toLocaleDateString()}: \n\n`
      orders.forEach((order, index) => {
        message = message + `Order Sr No ${index + 1} \n`
        message = message + `Name: ${order.cname} \n  Phone: ${order.cphone} \n Address: ${order.address} \n Delivery Items: ${order.itemsDetail} \n Instructions: ${order.specialInstructions} \n\n`

      })
      //sendTextMessage(message, driver.phone);
      //sending notification
      sendNotification(driverId!, { companyName: company.companyName, message: "New Order has been Assigned" })
      res.json({ isAdded: true, pathId: result.pathId });
    }).catch((error) => res.json({ isAdded: false }))
  }

}


export const assignPathController = (req: Request, res: Response) => {
  if (req.body.dateOfPath) {
    try {
      req.body.dateOfPath = new Date(req.body.dateOfPath)
    }
    catch (_error) {
      return res.status(403).json({
        isAdded: false,
        msg: "Error in Parameters"
      })
    }
  }
  let assignPathParams = pathOrder.safeParse(req.body)
  console.log(req.body)
  if (!assignPathParams.success) {
    console.log(assignPathParams.error)
    return res.status(403).json({
      isAdded: false,
      msg: "Error in Parameters"
    })
  }
  let pathId = assignPathParams.data.pathId
  let pathDate = assignPathParams.data.dateOfPath
  let driverId = assignPathParams.data.driverId
  assignPathToDriver(assignPathParams.data).then(async (result) => {
    let orders = await getOrdersWithPathId(pathId!)
    let driver = await getDriver(driverId!, req.body.companyId)
    let company = await getUser(driver.companyId!)//User is equivalent to Company
    let message = `Orders for ${pathDate.toLocaleDateString()}: \n\n`
    orders.forEach((order, index) => {
      message = message + `Order Sr No ${index + 1} \n`
      message = message + `Name: ${order.cname} \n Address: ${order.address} \n Delivery Items: ${order.itemsDetail} \n Instructions: ${order.specialInstructions} \n\n`

    })
    //sending text message
    //sendTextMessage(message, driver.phone)
    //sending Notification
    sendNotification(driverId!, { companyName: company.companyName, message: "New Order has been assigned" })
    res.json({ isAdded: true })
  }).catch((errro) => res.json({ isAdded: false }))
}


export const createPathController = async (req: Request, res: Response) => {
  req.body.dateOfPath = new Date(req.body.dateOfPath)
  let parsedData = pathOrder.safeParse(req.body)
  if (!parsedData.success) {
    return res.status(403).json({
      msg: "Error in  Details"
    });
  }
  try{
    const pathGeometry = await getGeometryApi(parsedData.data.startingLocation,parsedData.data.path.map(o=>o.latlng!))
    parsedData.data.pathGeometry = pathGeometry
  }
  catch(e){
   // delete parsedData.data.pathGeometry 
    console.log(e)
    //log  when not error in getGeometryApi
  }
 
  if (parsedData.data.pathId) {
    updatePath(parsedData.data).then((result) => {
      res.json({ isAdded: true });
    }).catch((error) => res.json({ isAdded: false }))
  }
  else {
    createPath(parsedData.data).then((result) => {
      res.json({ isAdded: true });
    }).catch((error) => res.json({ isAdded: false }))
  }

}

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
                }) .json({
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

// Reports
export const getDriverPathsReportController = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body || {}
    if (!startDate || !endDate) {
      return res.status(400).json({ err: ErrorCode.WrongInputs })
    }
    const start = new Date(startDate)
    const end = new Date(endDate)
    // normalize to cover the whole end day
    end.setHours(23, 59, 59, 999)
    const data = await getDriverPathsReport(req.body.companyId, start, end)
    return res.status(200).json(data)
  } catch (e) {
    return res.status(500).json({ err: ErrorCode.DbError })
  }
}

export const getAssignedPathsWithOrdersController = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body || {}
    if (!startDate || !endDate) {
      return res.status(400).json({ err: ErrorCode.WrongInputs })
    }
    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23,59,59,999)
    const data = await getAssignedPathsWithOrders(req.body.companyId, start, end)
    return res.status(200).json(data)
  } catch (e) {
    return res.status(500).json({ err: ErrorCode.DbError })
  }
}