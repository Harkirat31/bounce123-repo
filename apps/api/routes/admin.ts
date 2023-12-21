import express, { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import { authenticateJwt } from "../middleware"
import { driver, assignOrder, rentingItem, sideItem, order, pathOrder, changePriority, ErrorCode, user } from "types";
import { signIn, signUp, createDriver, assignOrderToDriver, createSideItem, createRentingItem, createOrder, getRentingItems, getSideItems, getDriver, getDrivers, getOrderswithDate, createPath, getPathswithDate, assignPathToDriver, changeOrderPriority, getUser, deleteOrders, getOrdersWithPathId, deletePath, updateUser, updatePath } from "db"
import axios from "axios";



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
  createDriver(parsedUserData.data).then((driver) => {
    res.json({ message: 'Sign Up successfully', isAdded: true });
  }).catch((error) => {
    return res.status(403).json({
      err: error,
      isAdded: false
    });
  })

})

router.post("/createPath", authenticateJwt, (req: Request, res: Response) => {
  req.body.dateOfPath = new Date(req.body.dateOfPath)
  let parsedData = pathOrder.safeParse(req.body)
  if (!parsedData.success) {
    console.log(parsedData.error)
    return res.status(403).json({
      msg: "Error in  Details"
    });
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

router.post("/createOrder", authenticateJwt, async (req: Request, res: Response) => {
  req.body.deliveryDate = new Date(req.body.deliveryDate)
  let parsedData = order.safeParse(req.body)
  if (!parsedData.success) {
    console.log(parsedData.error)
    return res.status(403).json({
      err: ErrorCode.WrongInputs
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
  createOrder(parsedData.data).then((user) => {
    res.json({ isAdded: true })
  }).catch((error) => res.json({ isAdded: false }))

})


router.post('/createRentingItem', authenticateJwt, (req: Request, res: Response) => {
  let parsedData = rentingItem.safeParse(req.body)
  if (!parsedData.success) {
    return res.status(403).json({
      msg: "Error in  Details"
    });
  }

  createRentingItem(parsedData.data).then((result) => {
    res.json({ isAdded: true });
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
    let driver = await getDriver(driverId!)
    let message = `Orders for ${pathDate.toLocaleDateString()}: \n\n`
    orders.forEach((order, index) => {
      //message = message + "https://minipunjabincanada/update/322323233232323"
      message = message + `Order Sr No ${index + 1} \n`
      message = message + `Name: ${order.cname} \n Address: ${order.address} \n Delivery Items: ${order.itemsDetail} \n Instructions: ${order.specialInstructions} \n\n`

    })
    axios.post('https://textbelt.com/text', {
      phone: driver.phone,
      message: message,
      key: '938113449037b129ba9966d882fa3de627c5a7b1HEm6hpQSEnEHKqztObgLzg3tn',
    }).then(response => {
      console.log(response.data);
    })
    res.json({ isAdded: true })
  }).catch((errro) => res.json({ isAdded: false }))
})



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
  getUser(req.body.companyId).then((result) => res.json(result)).catch(() => res.status(403).json({ msg: "Error" })
  )
})

router.get('/getRentingItems', authenticateJwt, (req: Request, res: Response) => {
  getRentingItems().then((result) => res.json(result)).catch(() => res.status(403).json({ msg: "Error" })
  )
})


router.get('/getSideItems', authenticateJwt, (req: Request, res: Response) => {
  getSideItems().then((result) => res.json(result)).catch(() => res.status(403).json({ msg: "Error" })
  )
})

router.get('/getDrivers', authenticateJwt, (req: Request, res: Response) => {
  getDrivers(req.body.companyId).then((result) => res.json(result)).catch(() => res.status(403).json({ msg: "Error" })
  )
})


router.post("/getOrders", authenticateJwt, (req: Request, res: Response) => {
  let parsedDate = req.body.date
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
      err: ErrorCode.FirebaseError
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
      err: ErrorCode.FirebaseError
    });
  })

})



export default router