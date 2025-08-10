import express, { Request, Response, NextFunction } from "express"

import { authenticateJwt } from "../middleware"
import {  assignOrder, } from "types";
import {  assignOrderToDriver } from "db"
import axios from "axios";
import { assignOrderAndPathController, assignPathController, cancelPathController, createPathController, deletePathController, generateOptimizeRoutes, getPathsController, getDriverPathsReportController, getAssignedPathsWithOrdersController } from "../controllers/pathController";

import { createDriverController, deleteDriverController, getDriversController } from "../controllers/driverController";
import { changePriorityController, createOrderController, deleteOrdersController, getDistinctOrdersDatesController, getOrdersController, updateOrderController } from "../controllers/orderController";
import { getUserController, updateUserController } from "../controllers/userController";

const router = express.Router();



router.post("/createDriver", authenticateJwt, createDriverController)


router.post('/deleteDriver', authenticateJwt, deleteDriverController)



router.post("/createPath", authenticateJwt,createPathController)

// this route handle situatoion when order directly assign to driver , thus it create path and then assign to driver
router.post("/assignOrderAndPath", authenticateJwt, assignOrderAndPathController)


router.post("/createOrder", authenticateJwt, createOrderController)


router.post('/assignPath', authenticateJwt, assignPathController)


router.post('/cancelPath', authenticateJwt, cancelPathController)

const sendTextMessage = (mess: string, contact: string) => {
  axios.post('https://textbelt.com/text', {
    phone: contact,
    message: mess,
    key: '938113449037b129ba9966d882fa3de627c5a7b1HEm6hpQSEnEHKqztObgLzg3tn',
  }).then(response => {
    console.log(response.data);
  })
}


// this is depreciated
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


router.post('/changePriority', authenticateJwt, changePriorityController)

router.get('/getUser', authenticateJwt, getUserController)

router.get('/getDrivers', authenticateJwt, getDriversController)


router.post("/getOrders", authenticateJwt, getOrdersController)

router.post("/getPaths", authenticateJwt, getPathsController)


router.post('/deleteOrders', authenticateJwt, deleteOrdersController)


router.post('/deletePath', authenticateJwt, deletePathController)



router.post("/updateUser", authenticateJwt, updateUserController)
router.post("/updateOrder", authenticateJwt, updateOrderController)

router.get("/getDistinctDatesOfOrders",authenticateJwt,getDistinctOrdersDatesController)

router.post("/generateOptimizePaths",authenticateJwt, generateOptimizeRoutes)

// reports
router.post("/reports/driver-paths", authenticateJwt, getDriverPathsReportController)
router.post("/reports/paths-with-orders", authenticateJwt, getAssignedPathsWithOrdersController)

export default router