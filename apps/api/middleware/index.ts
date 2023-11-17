import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express';

import { userSignIn } from "types"



export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
    const secretKey = process.env.JWT_SECRET
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log(secretKey)
        jwt.verify(token, secretKey!, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.body.jwtDetails = user;
            console.log(user)
            next();
        });
    }
    else {
        return res.sendStatus(403);
    }
}