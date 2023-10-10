import express,{ Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import {authenticateJwt} from "../middleware"
import { user , assignOrder,rentingItem,sideItem,order} from "types";
import {signIn,signUp,createUser,assignOrderToDriver,createSideItem, createRentingItem,createOrder} from "db"



const router = express.Router();

router.post("/createUser",authenticateJwt,(req:Request,res:Response)=>{
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

  router.post('/createSideItem',authenticateJwt,(req:Request,res:Response)=>{
    let parsedData = sideItem.safeParse(req.body)
    if (!parsedData.success) {
        return res.status(403).json({
          msg: "Error in  Details"
        });
    }
    createSideItem(parsedData.data).then((result)=>{
      res.json({ isAdded: true});
    }).catch((error)=>res.json({isAdded:false}))
  
    })

router.post("/createUser",authenticateJwt,(req:Request,res:Response)=>{
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

router.post("/createOrder",authenticateJwt,(req:Request,res:Response)=>{
  let parsedData = order.safeParse(req.body)
  if (!parsedData.success) {
    console.log(parsedData.error)
      return res.status(403).json({
        msg: "Error in  Details"
      });
  }
  createOrder(parsedData.data).then((user)=>{
    res.json({ isAdded: true})
  }).catch((error)=>res.json({isAdded:false}))
   
  })


router.post('/createRentingItem',authenticateJwt,(req:Request,res:Response)=>{
  let parsedData = rentingItem.safeParse(req.body)
  if (!parsedData.success) {
      return res.status(403).json({
        msg: "Error in  Details"
      });
  }
  createRentingItem(parsedData.data).then((result)=>{
    res.json({ isAdded: true});
  }).catch((error)=>res.json({isAdded:false}))

  })

  router.post('/assignOrder',authenticateJwt,(req:Request,res:Response)=>{
    let assignOrderParams = assignOrder.safeParse(req.body)
    if(!assignOrderParams.success){
        return res.status(403).json({
            isAdded:false,
            msg: "Error in Parameters"
          })
    }
    assignOrderToDriver(assignOrderParams.data.driverId,assignOrderParams.data.orderId).then((result)=>{
        return res.json({isAdded:true})
    })
  })

  export default router