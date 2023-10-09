import express,{ Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import {authenticateJwt} from "../middleware"
import { userSignIn } from "types";
import {signIn,signUp} from "db"

const router = express.Router();
const secretKey = process.env.JWT_SECRET||'secret';

router.post("/signin",(req:Request,res:Response)=>{
    let parsedSignInInput = userSignIn.safeParse(req.body)
    if (!parsedSignInInput.success) {
        return res.status(403).json({
          msg: "Error in User Details"
        });
      }
    const email = parsedSignInInput.data.email;
    const password = parsedSignInInput.data.password;
    signIn(email,password).then((user)=>{
      const token = jwt.sign({ id:user.uid }, secretKey, { expiresIn: '30 days',});
      res.json({ message: 'Login successfully', token });
    })
   
})
router.post("/signup",(req:Request,res:Response)=>{
  let parsedSignInInput = userSignIn.safeParse(req.body)
  if (!parsedSignInInput.success) {
      return res.status(403).json({
        msg: "Error in User Details"
      });
    }
  const email = parsedSignInInput.data.email;
  const password = parsedSignInInput.data.password;
  signUp({email,password}).then((uid)=>{
    res.json({ message: 'Sign Up successfully', uid });
  })
 
})




export default router