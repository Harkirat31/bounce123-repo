import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express';

const secretKey = process.env.JWT_SECRET;

export const authenticateJwt = (req:Request,res:Response,next:NextFunction)=>{
    console.log("Hello Jwt")
    next();
}