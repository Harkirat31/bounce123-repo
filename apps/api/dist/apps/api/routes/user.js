"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const types_1 = require("types");
const db_1 = require("db");
const router = express_1.default.Router();
router.post("/getOrders", middleware_1.authenticateJwt, (req, res) => {
    console.log(req.body);
    let parsedDriverId = types_1.userId.safeParse(req.body);
    if (!parsedDriverId.success) {
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
router.post("/updateCurrentLocation", middleware_1.authenticateJwt, (req, res) => {
    let parsedData = types_1.updateLocation.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(403).json({
            isUpdated: false,
            msg: "Error in Parameters"
        });
    }
    (0, db_1.updateCurrentLocation)(parsedData.data.driverId, parsedData.data.currentLocation).then((result) => {
        return res.json({
            isUpdated: true
        });
    });
});
router.post("/updateOrderStatus", middleware_1.authenticateJwt, (req, res) => {
    let parsedData = types_1.updateStatusOfOrder.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(403).json({
            isUpdated: false,
            msg: "Error in Parameters"
        });
    }
    (0, db_1.updateOrderStatus)(parsedData.data.orderId, parsedData.data.currentStatus).then((result) => {
        return res.json({
            isUpdated: true
        });
    });
});
exports.default = router;
