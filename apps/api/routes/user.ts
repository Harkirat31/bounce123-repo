import express,{ Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import {authenticateJwt} from "../middleware/auth"

const router = express.Router();

router.get("/hello",authenticateJwt,(req:Request,res:Response)=>{
    res.json({
        "hello":"hello"
    })
})

export default router