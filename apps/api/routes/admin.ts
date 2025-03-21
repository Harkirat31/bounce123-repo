import express, { Request, Response, NextFunction } from "express"

import { authenticateJwt } from "../middleware"
import { driver, assignOrder, sideItem, order, pathOrder, changePriority, ErrorCode, user } from "types";
import { createDriver, assignOrderToDriver, createSideItem, getDriver, getDrivers, getUser, updateUser, deleteDriver, sendNotification } from "db"
import axios from "axios";
import { getGeometryApi } from "../externalApis/osrmAPI";
import { createPath , createOrder , getOrderswithDate, getPathswithDate,updatePath,deletePath,getOrdersWithPathId,assignPathToDriver ,assignOrderAndPath, cancelPath, updatePathGemetry,changeOrderPriority,deleteOrders, getFutureOrdersDates} from "mongoose-db";
import { generateOptimizeRoutes } from "../controllers/pathController";
import { sendDriverCreationEmail } from "../services/mail/mail_services";
import { generatePassword } from "../utility/password/generate_password";

const router = express.Router();

router.post('/createSideItem', authenticateJwt, (req: Request, res: Response) => {
  let parsedData = sideItem.safeParse(req.body)
  if (!parsedData.success) {
    return res.status(403).json({
      msg: "Error in  Details"
    });
  }
  createSideItem(parsedData.data).then((result) => {
    res.json({ isAdded: true });
  }).catch((error) => res.json({ isAdded: false }))

})

router.post("/createDriver", authenticateJwt, (req: Request, res: Response) => {
  let parsedUserData = driver.safeParse(req.body)
  if (!parsedUserData.success) {
    return res.status(403).json({
      isadded: false,
      err: ErrorCode.WrongInputs
    });
  }
  let generatedPassword = generatePassword()
  createDriver(parsedUserData.data,generatedPassword).then(async (driver) => {
    await sendDriverCreationEmail(parsedUserData.data.email,generatedPassword,parsedUserData.data.companyName??"N/A")
    res.json({ message: 'Sign Up successfully', isAdded: true });
  }).catch((error) => {
    return res.status(403).json({
      err: error,
      isAdded: false
    });
  })

})


router.post('/deleteDriver', authenticateJwt, (req: Request, res: Response) => {
  if (req.body.driverId) {
    deleteDriver(req.body.driverId, req.body.companyId).then((_) => {
      res.json({ isDeleted: true });
    }).catch((_) => {
      res.status(403).json({
        isDeleted: false
      })
    })
  }
  else {
    res.status(403).json({
      isDeleted: false
    })
  }
})



router.post("/createPath", authenticateJwt, async (req: Request, res: Response) => {
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
    console.log(pathGeometry)
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

})
// this route handle situatoion when order directly assign to driver , thus it create path and then assign to driver
router.post("/assignOrderAndPath", authenticateJwt, async (req: Request, res: Response) => {
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
      sendTextMessage(message, driver.phone);
      //sending notification
      sendNotification(driverId!, { companyName: company.companyName, message: "New Order has been Assigned" })
      res.json({ isAdded: true, pathId: result.pathId });
    }).catch((error) => res.json({ isAdded: false }))
  }

})

router.post("/createOrder", authenticateJwt, async (req: Request, res: Response) => {
  req.body.deliveryDate = new Date(req.body.deliveryDate)
  let parsedData = order.safeParse(req.body)
  if (!parsedData.success) {
    return res.status(403).json({
      err: ErrorCode.WrongInputs
    });
  }
  // handle creation limit 
 
  let company = await getUser( req.body.companyId)
  if(company.availableCount<=0){
    return res.status(403).json({
      err: ErrorCode.OrderLimitIncrease
    });
  }


  const apiKey = process.env.MAPS_API_KEY;
  let location = { lat: 0, lng: 0 }
  let placeId = ""

  try {
    const resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(parsedData.data.address)}&key=${apiKey}`, {
      method: "GET"
    })
    const jsonData = await resp.json()
    const results = jsonData.results;

    if (results.length > 0) {
      location = results[0].geometry.location;
      placeId = results[0].place_id;
    } else {
      return res.status(403).json({
        err: ErrorCode.AddressError
      });
    }
  }
  catch (e) {
    return res.status(403).json({
      err: ErrorCode.AddressError
    });
  }

  parsedData.data.location = location
  parsedData.data.placeId = placeId
  createOrder(parsedData.data).then(async (order) => {
    //decrease count
    await updateUser({...company,availableCount:company.availableCount-1})
    res.json({ isAdded: true })
  }).catch((error) => res.json({ isAdded: false }))

})


router.post('/assignPath', authenticateJwt, (req: Request, res: Response) => {
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
    //sendindd text message
    sendTextMessage(message, driver.phone)
    //sending Notification
    sendNotification(driverId!, { companyName: company.companyName, message: "New Order has been assigned" })
    res.json({ isAdded: true })
  }).catch((errro) => res.json({ isAdded: false }))
})


router.post('/cancelPath', authenticateJwt, (req: Request, res: Response) => {
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

  if (!assignPathParams.success) {
    console.log(assignPathParams.error)
    return res.status(403).json({
      isCancelled: false,
      msg: "Error in Parameters"
    })
  }


  cancelPath(assignPathParams.data).then(async (result: any) => {

    console.log("Modified path",result.modifiedPath)

    //update geometry of new Path
    try{
      const pathGeometry = await getGeometryApi(assignPathParams.data.startingLocation,result.modifiedPath)
      assignPathParams.data.pathGeometry = pathGeometry
    }
    catch(e){
      console.log(e)
    }
    await updatePathGemetry(assignPathParams.data)
    res.json({ isCancelled: result, isPathDeleted: result.isPathDeleted, modifiedPath: result.modifiedPath })
  }).catch((error) => {
    res.json({ isCancelled: false, isPathDeleted: false })
  })

})

const sendTextMessage = (mess: string, contact: string) => {
  axios.post('https://textbelt.com/text', {
    phone: contact,
    message: mess,
    key: '938113449037b129ba9966d882fa3de627c5a7b1HEm6hpQSEnEHKqztObgLzg3tn',
  }).then(response => {
    console.log(response.data);
  })
}



router.post('/assignOrder', authenticateJwt, (req: Request, res: Response) => {
  let assignOrderParams = assignOrder.safeParse(req.body)
  if (!assignOrderParams.success) {
    return res.status(403).json({
      isAdded: false,
      msg: "Error in Parameters"
    })
  }
  assignOrderToDriver(assignOrderParams.data.driverId, assignOrderParams.data.driverName, assignOrderParams.data.orderId).then((result) => {
    res.json({ isAdded: true })
  }).catch((errro) => res.json({ isAdded: false }))
})

router.post('/changePriority', authenticateJwt, (req: Request, res: Response) => {
  let changePriorityParams = changePriority.safeParse(req.body)
  if (!changePriorityParams.success) {
    return res.status(403).json({
      isAdded: false,
      msg: "Error in Parameters"
    })
  }
  changeOrderPriority(changePriorityParams.data.priority, changePriorityParams.data.orderId).then((result) => {
    res.json({ isAdded: true })
  }).catch((errr) => res.json({ isAdded: false }))
})

router.get('/getUser', authenticateJwt, (req: Request, res: Response) => {
  getUser(req.body.companyId).then((result) => res.json(result)).catch((e) => {
    console.log(e)
    res.status(403).json({ msg: "Error" })
  })
})

router.get('/getDrivers', authenticateJwt, (req: Request, res: Response) => {
  getDrivers(req.body.companyId).then((result) => res.json(result)).catch(() => res.status(403).json({ msg: "Error" })
  )
})


router.post("/getOrders", authenticateJwt, (req: Request, res: Response) => {
  let parsedDate = req.body.date
  console.log(parsedDate)
  if (!parsedDate) {
    return res.status(403).json({
      msg: "Error in  Details "
    });
  }
  getOrderswithDate(new Date(parsedDate), req.body.companyId).then((orders) => {
    res.json(orders);
  }).catch(() => {
    res.status(403).json({
      msg: "Error fetching from firestore"
    })
  })
})

router.post("/getPaths", authenticateJwt, (req: Request, res: Response) => {
  let parsedDate = req.body.date
  if (!parsedDate) {
    return res.status(403).json({
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
})


router.post('/deleteOrders', authenticateJwt, (req: Request, res: Response) => {
  if (req.body.orders) {
    console.log(req.body.orders)
    deleteOrders(req.body.orders).then((_) => {
      res.json({ isDeleted: true });
    }).catch((_) => {
      res.status(403).json({
        isDeleted: false
      })
    })
  }
  else {
    res.status(403).json({
      isDeleted: false
    })
  }
})


router.post('/deletePath', authenticateJwt, (req: Request, res: Response) => {
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
})





router.post("/updateUser", authenticateJwt, (req: Request, res: Response) => {
  let parsedUserData = user.safeParse(req.body)
  if (!parsedUserData.success) {
    return res.status(403).json({
      err: ErrorCode.WrongInputs
    });
  }
  const apiKey = process.env.MAPS_API_KEY;
  let location = { lat: 0, lng: 0 }
  let placeId = ""
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(parsedUserData.data.address)}&key=${apiKey}`, {
    method: "GET"
  }).then((respMapsApi) => respMapsApi.json().then((mapsData) => {
    const results = mapsData.results;
    if (results.length > 0) {
      console.log("location")
      location = results[0].geometry.location;
      placeId = results[0].place_id;
    } else {
      //return locatin not right Error
      return res.status(403).json({
        err: ErrorCode.AddressError
      });
    }
    if (parsedUserData.success) {
      parsedUserData.data.userId = req.body.companyId
      parsedUserData.data.location = location
      parsedUserData.data.placeId = placeId
      updateUser(parsedUserData.data).then((result) => {
        res.json({ isUpdated: true });
      }).catch((error) => {
        return res.status(403).json({
          err: error
        });
      })
    }

  }).catch((jsonParseError) => {
    return res.status(403).json({
      err: ErrorCode.JsonParseError
    });
  })).catch((mapsAPIError) => {
    return res.status(403).json({
      err: ErrorCode.DbError
    });
  })

})

router.get("/getFutureOrdersDates",authenticateJwt,(req: Request, res: Response) => {
  getFutureOrdersDates(req.body.companyId,new Date(req.body.date)).then((data) => {
        res.status(200).json(data)
    }).catch((error) => {
        console.log(error)
        res.status(403).json({
            err: "Error"
        })
    })

})

router.post("/generateOptimizePaths",authenticateJwt, generateOptimizeRoutes)


export default router