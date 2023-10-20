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
router.post("/createUser", middleware_1.authenticateJwt, (req, res) => {
    let parsedUserData = types_1.driver.safeParse(req.body);
    if (!parsedUserData.success) {
        return res.status(403).json({
            msg: "Error in User Details"
        });
    }
    (0, db_1.createDriver)(parsedUserData.data).then((driver) => {
        res.json({ message: 'Sign Up successfully', driver });
    });
});
router.post('/createSideItem', middleware_1.authenticateJwt, (req, res) => {
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
router.post("/createDriver", middleware_1.authenticateJwt, (req, res) => {
    let parsedUserData = types_1.driver.safeParse(req.body);
    if (!parsedUserData.success) {
        return res.status(403).json({
            msg: "Error in User Details"
        });
    }
    (0, db_1.createDriver)(parsedUserData.data).then((driver) => {
        res.json({ message: 'Sign Up successfully', driver });
    }).catch((error) => {
        return res.status(403).json({
            msg: "Error in User Details",
            err: error
        });
    });
});
router.post("/createOrder", middleware_1.authenticateJwt, (req, res) => {
    req.body.deliveryDate = new Date(req.body.deliveryDate);
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
router.post('/createRentingItem', middleware_1.authenticateJwt, (req, res) => {
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
router.post('/assignOrder', middleware_1.authenticateJwt, (req, res) => {
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
router.get('/getRentingItems', middleware_1.authenticateJwt, (req, res) => {
    console.log(req.body.userId);
    (0, db_1.getRentingItems)().then((result) => res.json(result)).catch(() => res.status(403).json({ msg: "Error" }));
});
router.get('/getSideItems', middleware_1.authenticateJwt, (req, res) => {
    (0, db_1.getSideItems)().then((result) => res.json(result)).catch(() => res.status(403).json({ msg: "Error" }));
});
router.get('/getDrivers', middleware_1.authenticateJwt, (req, res) => {
    (0, db_1.getDrivers)().then((result) => res.json(result)).catch(() => res.status(403).json({ msg: "Error" }));
});
router.post("/getOrders", middleware_1.authenticateJwt, (req, res) => {
    console.log(req.body);
    let parsedDate = req.body.date;
    if (!parsedDate) {
        return res.status(403).json({
            msg: "Error in Driver Id"
        });
    }
    (0, db_1.getOrderswithDate)(new Date(parsedDate)).then((orders) => {
        res.json(orders);
    }).catch(() => {
        res.status(403).json({
            msg: "Error fetching from firestore"
        });
    });
});
exports.default = router;
