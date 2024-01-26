import express, { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import { authenticateJwt, authenticateJwtDriver } from "../middleware"
import { userId, updateLocation, updateStatusOfOrder } from "types";
import { getDriverWithPaths, getOrders, updateCurrentLocation, updateOrderStatus } from "db"

const router = express.Router();

router.get("/getDriver", authenticateJwtDriver, (req: Request, res: Response) => {
    getDriverWithPaths(req.body.uid).then((data) => {
        res.status(200).json(data)
    }).catch((error) => {
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

router.post("/updateOrderStatus", authenticateJwtDriver, (req: Request, res: Response) => {
    console.log(req.body)
    let parsedData = updateStatusOfOrder.safeParse(req.body)
    if (!parsedData.success) {
        return res.status(403).json({
            isUpdated: false,
            msg: "Error in Parameters"
        });
    }
    updateOrderStatus(parsedData.data.orderId, parsedData.data.currentStatus).then((result) => {
        return res.json({
            isUpdated: true
        })
    }).catch((error) => {
        return res.json({
            isUpdated: false
        })
    })

})

export default router