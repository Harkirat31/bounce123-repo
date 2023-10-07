"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUser = exports.signIn = void 0;
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert("serviceAccount.json"),
});
const db = admin.firestore();
function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        const x = yield db.collection('test').doc("1").get();
        console.log(x);
    });
}
const signIn = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAqhTnwk7mkiABKb1onJDVJI8wNmhJbe80', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "email": email, "password": password, "returnSecureToken": true })
        }).then(response => {
            response.json().then((responseData) => __awaiter(void 0, void 0, void 0, function* () {
                if (response.status !== 200) {
                    return reject(responseData);
                }
                if (!responseData.localId) {
                    return reject(new Error("Error Parsing response from google SignIn Api"));
                }
                yield (0, exports.getUser)(responseData.localId).then((user) => {
                    resolve(user);
                }).catch((error) => {
                    return reject(new Error("Error Fetching User from getUser Method"));
                });
            })).catch((error) => {
                reject(new Error("Json Parsing Error" + error));
            });
        })
            .catch((error) => {
            reject(new Error("Error in sign in through Google Api"));
        });
    }));
});
exports.signIn = signIn;
const getUser = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        email: "dexter@gmail.com",
        name: "Dexter",
        role: "",
        vehicleCapacity: 5,
        phone: "",
        uid: uid,
        vehicleStyle: "Pick Up"
    };
});
exports.getUser = getUser;
const createUser = (newUserData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield admin.auth().createUser({
        email: newUserData.email,
        password: newUserData.password, // default password, link will be sent to user to create add new password
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db.collection('users').doc(user.uid).set({
            email: user.email
        }).then((result) => true).catch(error => error);
    })).catch(error => error);
});
exports.createUser = createUser;
//createUser({email:"harry@gmail.com",password:"password"}).then((r)=>console.log("Hello"+r)).catch((s)=>console.log("error"))
//getUser("uid").then((x)=>console.log(x))
(0, exports.signIn)("harkiratsingh.tu@gmail.com", "passwor").then((x) => console.log(x)).catch((e) => console.log(e));
