import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express';

import {userSignIn} from "types"

const secretKey = process.env.JWT_SECRET;

export const authenticateJwt = (req:Request,res:Response,next:NextFunction)=>{
    console.log("Hello Jwt")
    console.log(secretKey)
    next();
}