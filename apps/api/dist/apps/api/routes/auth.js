"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("types");
const router = express_1.default.Router();
const secretKey = process.env.JWT_SECRET || 'secret';
router.post("/signin", (req, res) => {
    let parsedSignInInput = types_1.userSignIn.safeParse(req.body);
    if (!parsedSignInInput.success) {
        return res.status(403).json({
            msg: "Error in User Details"
        });
    }
    const username = parsedSignInInput.data.username;
    const password = parsedSignInInput.data.password;
    const user = { userId: "id", username, role: "driver" };
    const token = jsonwebtoken_1.default.sign({ id: user.userId }, secretKey, { expiresIn: '30 days', });
    res.json({ message: 'Login successfully', token });
});
exports.default = router;
