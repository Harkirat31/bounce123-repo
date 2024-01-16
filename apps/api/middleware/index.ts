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
            }
            req.body.jwtDetails = user;
            req.body.companyId = req.body.jwtDetails.user.userId
            req.body.companyName = req.body.jwtDetails.user.companyName
            req.body.companyLocation = req.body.jwtDetails.user.location
            next();
        });
    }
    else {
        return res.sendStatus(401);
    }
}

export const authenticateJwtDriver = (req: Request, res: Response, next: NextFunction) => {
    const secretKey = process.env.JWT_SECRET
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, secretKey!, (err, uid) => {
            if (err) {
                return res.sendStatus(401);
            }
            req.body.jwtDetails = uid;
            req.body.uid = req.body.jwtDetails.uid;
            next();
        });
    }
    else {
        return res.sendStatus(401);
    }
}