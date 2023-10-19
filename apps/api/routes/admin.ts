import express, { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import { authenticateJwt } from "../middleware"
import { driver, assignOrder, rentingItem, sideItem, order } from "types";
import { signIn, signUp, createDriver, assignOrderToDriver, createSideItem, createRentingItem, createOrder, getRentingItems, getSideItems, getDriver, getDrivers, getOrderswithDate } from "db"



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

router.post("/createOrder", authenticateJwt, (req: Request, res: Response) => {
  req.body.deliveryDate = new Date(req.body.deliveryDate)
  let parsedData = order.safeParse(req.body)
  if (!parsedData.success) {
    console.log(parsedData.error)
    return res.status(403).json({
      msg: "Error in  Details"
    });
  }
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
  assignOrderToDriver(assignOrderParams.data.driverId, assignOrderParams.data.orderId).then((result) => {
    return res.json({ isAdded: true })
  })
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
      msg: "Error in Driver Id"
    });
  }
  getOrderswithDate(new Date(parsedDate)).then((orders) => {
    res.json({ orders: orders });
  }).catch(() => {
    res.status(403).json({
      msg: "Error fetching from firestore"
    })
  })
})

export default router