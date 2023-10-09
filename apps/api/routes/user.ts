import express,{ Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import {authenticateJwt} from "../middleware"
import { userId } from "types";
import {getOrders} from "db"

const router = express.Router();
router.post("/getOrders",(req:Request,res:Response)=>{
    console.log(req.body)
    let parsedDriverId = userId.safeParse(req.body)
    if (!parsedDriverId.success) {
        console.log("here")
        return res.status(403).json({
          msg: "Error in Driver Id"
        });
    }
    getOrders(parsedDriverId.data.uid).then((orders)=>{
      res.json({ orders: orders});
    }).catch(()=>{
        res.status(403).json({
            msg:"Error fetching from firestore"
        })
    })
})
export default router