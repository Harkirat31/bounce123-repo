"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("types");
const db_1 = require("db");
const router = express_1.default.Router();
const secretKey = process.env.JWT_SECRET || 'secret';
router.post("/signin", (req, res) => {
    let parsedSignInInput = types_1.userSignIn.safeParse(req.body);
    if (!parsedSignInInput.success) {
        return res.status(403).json({
            msg: "Error in User Details"
        });
    }
    const email = parsedSignInInput.data.email;
    const password = parsedSignInInput.data.password;
    (0, db_1.signIn)(email, password).then((user) => {
        const token = jsonwebtoken_1.default.sign({ id: user.uid }, secretKey, { expiresIn: '30 days', });
        res.json({ message: 'Login successfully', token });
    });
});
router.post("/signup", (req, res) => {
    let parsedSignInInput = types_1.userSignIn.safeParse(req.body);
    if (!parsedSignInInput.success) {
        return res.status(403).json({
            msg: "Error in User Details"
        });
    }
    const email = parsedSignInInput.data.email;
    const password = parsedSignInInput.data.password;
    (0, db_1.signUp)({ email, password }).then((uid) => {
        res.json({ message: 'Sign Up successfully', uid });
    });
});
exports.default = router;
