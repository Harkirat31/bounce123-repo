import express,{ Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import {authenticateJwt} from "../middleware"
import { user } from "types";
import {signIn,signUp,createUser} from "db"



const router = express.Router();

router.post("/createUser",(req:Request,res:Response)=>{
    let parsedUserData = user.safeParse(req.body)
    if (!parsedUserData.success) {
        return res.status(403).json({
          msg: "Error in User Details"
        });
    }
    createUser(parsedUserData.data).then((user)=>{
      res.json({ message: 'Sign Up successfully', user });
    })
   
  })