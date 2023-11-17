import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express';

import { userSignIn } from "types"



export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
    const secretKey = process.env.JWT_SECRET
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, secretKey!, (err, user) => {
            if (err) {
                return res.sendStatus(401);
                console.log("Here")
            }
            req.body.jwtDetails = user;
            req.body.companyId = req.body.jwtDetails.user.userId
            next();
        });
    }
    else {
        console.log("Here")
        return res.sendStatus(401);
    }
}