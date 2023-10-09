"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const types_1 = require("types");
const db_1 = require("db");
const router = express_1.default.Router();
router.post("/getOrders", (req, res) => {
    console.log(req.body);
    let parsedDriverId = types_1.userId.safeParse(req.body);
    if (!parsedDriverId.success) {
        console.log("here");
        return res.status(403).json({
            msg: "Error in Driver Id"
        });
    }
    (0, db_1.getOrders)(parsedDriverId.data.uid).then((orders) => {
        res.json({ orders: orders });
    }).catch(() => {
        res.status(403).json({
            msg: "Error fetching from firestore"
        });
    });
});
exports.default = router;
