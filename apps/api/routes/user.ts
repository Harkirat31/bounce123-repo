import express,{ Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import {authenticateJwt} from "../middleware"
import { userSignIn } from "types";

const router = express.Router();

router.get("/getOrders",authenticateJwt,(req:Request,res:Response)=>{
    res.json({
        "hello":"hello"
    })
})
export default router