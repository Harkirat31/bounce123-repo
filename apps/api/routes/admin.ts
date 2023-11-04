import express, { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import { authenticateJwt } from "../middleware"
import { driver, assignOrder, rentingItem, sideItem, order, pathOrder } from "types";
import { signIn, signUp, createDriver, assignOrderToDriver, createSideItem, createRentingItem, createOrder, getRentingItems, getSideItems, getDriver, getDrivers, getOrderswithDate, createPath, getPathswithDate } from "db"



const router = express.Router();

router.post("/createUser", authenticateJwt, (req: Request, res: Response) => {
  let parsedUserData = driver.safeParse(req.body)
  if (!parsedUserData.success) {
    return res.status(403).json({
      msg: "Error in User Details"
    });
  }
  createDriver(parsedUserData.data).then((driver) => {
    res.json({ message: 'Sign Up successfully', driver });
  })

})

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
      msg: "Error in User Details"
    });
  }
  createDriver(parsedUserData.data).then((driver) => {
    res.json({ message: 'Sign Up successfully', driver });
  }).catch((error) => {
    return res.status(403).json({
      msg: "Error in User Details",
      err: error
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
  createPath(parsedData.data).then((result) => {
    res.json({ isAdded: true });
  }).catch((error) => res.json({ isAdded: false }))
})

router.post("/createOrder", authenticateJwt, async (req: Request, res: Response) => {
  req.body.deliveryDate = new Date(req.body.deliveryDate)
  let parsedData = order.safeParse(req.body)
  if (!parsedData.success) {
    console.log(parsedData.error)
    return res.status(403).json({
      msg: "Error in  Details"
    });
  }
  const apiKey = 'AIzaSyANu4rP79yzZDjyHT3ExDgGb_6gh9IxbwE';
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
      console.log('No results found for the given address.');
    }
  }
  catch (e) {
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


router.get('/getRentingItems', authenticateJwt, (req: Request, res: Response) => {
  console.log(req.body.userId)
  getRentingItems().then((result) => res.json(result)).catch(() => res.status(403).json({ msg: "Error" })
  )
})

router.get('/getSideItems', authenticateJwt, (req: Request, res: Response) => {
  getSideItems().then((result) => res.json(result)).catch(() => res.status(403).json({ msg: "Error" })
  )
})

router.get('/getDrivers', authenticateJwt, (req: Request, res: Response) => {
  getDrivers().then((result) => res.json(result)).catch(() => res.status(403).json({ msg: "Error" })
  )
})


router.post("/getOrders", authenticateJwt, (req: Request, res: Response) => {
  console.log(req.body)
  let parsedDate = req.body.date
  if (!parsedDate) {
    return res.status(403).json({
      msg: "Error in  Details "
    });
  }
  getOrderswithDate(new Date(parsedDate)).then((orders) => {
    res.json(orders);
  }).catch(() => {
    res.status(403).json({
      msg: "Error fetching from firestore"
    })
  })
})

router.post("/getPaths", authenticateJwt, (req: Request, res: Response) => {
  console.log(req.body)
  let parsedDate = req.body.date
  if (!parsedDate) {
    return res.status(403).json({
      msg: "Error in Details"
    });
  }
  getPathswithDate(new Date(parsedDate)).then((paths) => {
    res.json(paths);
  }).catch(() => {
    res.status(403).json({
      msg: "Error fetching from firestore"
    })
  })
})


export default router