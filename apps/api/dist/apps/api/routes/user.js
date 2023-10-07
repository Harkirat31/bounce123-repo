"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
router.get("/getOrders", middleware_1.authenticateJwt, (req, res) => {
    res.json({
        "hello": "hello"
    });
});
exports.default = router;
