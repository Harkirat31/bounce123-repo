"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const types_1 = require("types");
const db_1 = require("db");
const router = express_1.default.Router();
router.post("/createUser", (req, res) => {
    let parsedUserData = types_1.user.safeParse(req.body);
    if (!parsedUserData.success) {
        return res.status(403).json({
            msg: "Error in User Details"
        });
    }
    (0, db_1.createUser)(parsedUserData.data).then((user) => {
        res.json({ message: 'Sign Up successfully', user });
    });
});
