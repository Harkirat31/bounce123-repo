"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = void 0;
const secretKey = process.env.JWT_SECRET;
const authenticateJwt = (req, res, next) => {
    console.log("Hello Jwt");
    next();
};
exports.authenticateJwt = authenticateJwt;
