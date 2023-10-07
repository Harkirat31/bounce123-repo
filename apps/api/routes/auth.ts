import express,{ Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import {authenticateJwt} from "../middleware"
import { userSignIn } from "types";

const router = express.Router();
const secretKey = process.env.JWT_SECRET||'secret';

router.post("/signin",(req:Request,res:Response)=>{
    let parsedSignInInput = userSignIn.safeParse(req.body)
    if (!parsedSignInInput.success) {
        return res.status(403).json({
          msg: "Error in User Details"
        });
      }
    const username = parsedSignInInput.data.email;
    const password = parsedSignInInput.data.password;

    const user = {userId:"id",username,role:"driver"}
    const token = jwt.sign({ id:user.userId }, secretKey, { expiresIn: '30 days',});
    res.json({ message: 'Login successfully', token });
})
export default router