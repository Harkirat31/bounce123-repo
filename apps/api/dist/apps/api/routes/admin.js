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
router.post('/createSideItem', (req, res) => {
    let parsedData = types_1.sideItem.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(403).json({
            msg: "Error in  Details"
        });
    }
    (0, db_1.createSideItem)(parsedData.data).then((result) => {
        res.json({ isAdded: true });
    }).catch((error) => res.json({ isAdded: false }));
});
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
router.post("/createOrder", (req, res) => {
    let parsedData = types_1.order.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        return res.status(403).json({
            msg: "Error in  Details"
        });
    }
    (0, db_1.createOrder)(parsedData.data).then((user) => {
        res.json({ isAdded: true });
    }).catch((error) => res.json({ isAdded: false }));
});
router.post('/createRentingItem', (req, res) => {
    let parsedData = types_1.rentingItem.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(403).json({
            msg: "Error in  Details"
        });
    }
    (0, db_1.createRentingItem)(parsedData.data).then((result) => {
        res.json({ isAdded: true });
    }).catch((error) => res.json({ isAdded: false }));
});
router.post('/assignOrder', (req, res) => {
    let assignOrderParams = types_1.assignOrder.safeParse(req.body);
    if (!assignOrderParams.success) {
        return res.status(403).json({
            isAdded: false,
            msg: "Error in Parameters"
        });
    }
    (0, db_1.assignOrderToDriver)(assignOrderParams.data.driverId, assignOrderParams.data.orderId).then((result) => {
        return res.json({ isAdded: true });
    });
});
exports.default = router;