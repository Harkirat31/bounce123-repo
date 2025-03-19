import express, { Request, Response } from "express"

import { authenticateJwt, authenticateJwtDriver } from "../middleware"
import { userId, updateLocation, ErrorCode } from "types";
import {  getOrders, saveFCMToken, updateCurrentLocation } from "db"
import { getDriverWithPaths, updateNextOrderOfPathController, updateOrderStatusController, updatePathAcceptanceByDriverController } from "../controllers/driverController";
import { getFuturePathDates } from "mongoose-db";

const router = express.Router();


router.post("/saveFCMToken", authenticateJwtDriver, (req: Request, res: Response) => {
    saveFCMToken(req.body.uid, req.body.FCMToken).then((data) => {
        res.status(200).json({ isAdded: true })
    }).catch((error) => {
        console.log(error)
        res.status(403).json({
            isAdded: false,
            err: ErrorCode.DbError
        })
    })
})

//retrieve all paths of driver as well


// router.post("/getDriver", authenticateJwtDriver, (req: Request, res: Response) => {
//     getDriverWithPaths(req.body.uid,new Date(req.body.date)).then((data) => {
//         res.status(200).json(data)
//     }).catch((error) => {
//         console.log(error)
//         res.status(403).json({
//             err: "Error"
//         })
//     })

// })

//retrieve all paths of driver as well
router.post("/getDriver", authenticateJwtDriver, getDriverWithPaths)

router.post("/getFuturePathDates",authenticateJwtDriver,(req: Request, res: Response) => {
    getFuturePathDates(req.body.uid,new Date(req.body.date)).then((data) => {
        res.status(200).json(data)
    }).catch((error) => {
        console.log(error)
        res.status(403).json({
            err: "Error"
        })
    })

})

router.post("/getOrders", authenticateJwt, (req: Request, res: Response) => {
    let parsedDriverId = userId.safeParse(req.body)
    if (!parsedDriverId.success) {
        return res.status(403).json({
            msg: "Error in Driver Id"
        })
    }
    getOrders(parsedDriverId.data.uid).then((orders) => {
        res.json({ orders: orders });
    }).catch(() => {
        res.status(403).json({
            msg: "Error fetching from firestore"
        })
    })
})

router.post("/updateCurrentLocation", authenticateJwt, (req: Request, res: Response) => {
    let parsedData = updateLocation.safeParse(req.body)
    if (!parsedData.success) {
        return res.status(403).json({
            isUpdated: false,
            msg: "Error in Parameters"
        });
    }
    updateCurrentLocation(parsedData.data.driverId, parsedData.data.currentLocation).then((result) => {
        return res.json({
            isUpdated: true
        })
    })
})

router.post("/updateOrderStatus", authenticateJwtDriver, updateOrderStatusController)

router.post("/updateNextOrderOfPath",authenticateJwtDriver,updateNextOrderOfPathController)


router.post("/updatePathAcceptanceByDriver", authenticateJwtDriver,updatePathAcceptanceByDriverController)

export default router