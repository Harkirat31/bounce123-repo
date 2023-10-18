"use strict";
//import path from 'path';
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
exports.getSideItems = exports.getRentingItems = exports.assignOrderToDriver = exports.updateOrderStatus = exports.updateCurrentLocation = exports.getOrders = exports.createOrder = exports.createSideItem = exports.createRentingItem = exports.createDriver = exports.signUp = exports.getDriver = exports.signIn = void 0;
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin SDK
//const serviceaccountPath = path.join(__dirname,'./','serviceAccount.json')
admin.initializeApp({
    credential: admin.credential.cert("/Users/harry/dev/projects/bounce123/packages/db/serviceAccount.json"),
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
                yield (0, exports.getDriver)(responseData.localId).then((driver) => {
                    resolve(driver);
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
const getDriver = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db.collection("drivers").doc(uid).get().then((documentSnapshot) => {
            resolve(Object(documentSnapshot.data()));
        });
    });
});
exports.getDriver = getDriver;
const signUp = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        admin.auth().createUser({
            email: authUser.email,
            password: authUser.password
        }).then((firebaseUser) => resolve(firebaseUser.uid)).catch((error) => reject(new Error("Error creating Firebase Auth User")));
    });
});
exports.signUp = signUp;
const createDriver = (newUserDetail) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db.collection('drivers').doc(newUserDetail.uid).set(newUserDetail).then((result) => {
            resolve(newUserDetail);
        }).catch(() => reject(new Error("Error creating driver in firebase db")));
    });
});
exports.createDriver = createDriver;
const createRentingItem = (rentingItemData) => {
    return new Promise((resolve, reject) => {
        db.collection("renting_items").add(rentingItemData).then(() => resolve("Success")).catch(() => new Error("Error"));
    });
};
exports.createRentingItem = createRentingItem;
const createSideItem = (sideItemData) => {
    return new Promise((resolve, reject) => {
        db.collection("side_items").add(sideItemData).then(() => resolve("Success")).catch(() => reject(new Error("Error")));
    });
};
exports.createSideItem = createSideItem;
const createOrder = (orderData) => {
    return new Promise((resolve, reject) => {
        db.collection("orders").add(orderData).then(() => resolve("Success")).catch(() => new Error("Error"));
    });
};
exports.createOrder = createOrder;
const getOrders = (driverId) => {
    return new Promise((resolve, reject) => {
        db.collection('orders').where("driverId", "==", driverId).get().then((result) => {
            let orders = result.docs.map((doc) => doc.data());
            resolve(orders);
        }).catch((error) => reject(new Error("Error fetching orders of driver")));
    });
};
exports.getOrders = getOrders;
const updateCurrentLocation = (driverId, location) => {
    return new Promise((resolve, reject) => {
        db.collection('drivers').doc(driverId).update({
            currentLocation: location
        }).then((result) => resolve(result)).catch((error) => reject(new Error("Error")));
    });
};
exports.updateCurrentLocation = updateCurrentLocation;
const updateOrderStatus = (orderId, currentStatus) => {
    return new Promise((resolve, reject) => {
        db.collection('orders').doc(orderId).update({
            currentStatus: currentStatus
        }).then((result) => resolve(result)).catch((error) => reject(new Error("Error")));
    });
};
exports.updateOrderStatus = updateOrderStatus;
const assignOrderToDriver = (driverId, orderId) => {
    return new Promise((resolve, reject) => {
        db.collection('orders').doc(orderId).update({
            driverId: driverId
        });
    });
};
exports.assignOrderToDriver = assignOrderToDriver;
const getRentingItems = () => {
    return new Promise((resolve, reject) => {
        db.collection("renting_items").get().then((result) => {
            let rentingItems = result.docs.map((doc) => doc.data());
            if (rentingItems.length > 0) {
                resolve(rentingItems);
            }
            else {
                resolve([]);
            }
        }).catch((error) => reject(new Error("Error Fetching Data")));
    });
};
exports.getRentingItems = getRentingItems;
const getSideItems = () => {
    return new Promise((resolve, reject) => {
        db.collection("side_items").get().then((result) => {
            let sideItems = result.docs.map((doc) => {
                let sideItem = doc.data();
                sideItem.sideItemId = doc.id;
                return sideItem;
            });
            if (sideItems.length > 0) {
                resolve(sideItems);
            }
            else {
                resolve([]);
            }
        }).catch((error) => reject(new Error("Error Fetching Data")));
    });
};
exports.getSideItems = getSideItems;
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, exports.getRentingItems)().then((result) => console.log(result));
    //assignOrderToDriver("7GnMyRNWRzMU2cShccm4JkrRuEu1","VuXKAvFciTXe4Wo4axrR")
    //updateCurrentLocation("7GnMyRNWRzMU2cShccm4JkrRuEu1",{lat:"1",long:"2"})
    // createUser({
    //   uid:"7GnMyRNWRzMU2cShccm4JkrRuEu1",
    //   currentLocation:{lat:"3.44",long:"5.99"},
    //   isAutomaticallyTracked:true,
    //   name:"Dexter",
    //   phone:"4165678099",
    //   role:"driver",
    //   vehicleCapacity:20,
    //   vehicleStyle:"Pick Up",
    //   email:"harry@gmail.com"
    // }).then((r)=>console.log(r))
    // await getOrders("driverId").then((result)=>console.log(result))
    //await createUser({email:"harry@gmail.com",password:"password"},{email:"harry@gmail.com"}).then((r)=>console.log(r)).catch((s)=>console.log("error"))
    //await signIn("harry@gmail.com","password").then((x)=>console.log(x)).catch((e)=>console.log(e))
    // createRentingItem(  {
    //     title:"Animal Tiger",
    //     deliveryPrice:100,
    //     capacity:20,
    //     category:"Bouncey Castle"
    //   } ).then((result)=>console.log(result))
    //createSideItem(  {   title:"Blower",capacity:1, } ).then((result)=>console.log(result))
    // createOrder({
    //   rentingItemId:"aKzczHh3fPQFS3tXlzJM",
    //   location:{lat:"3.4545",long:"7.766"},
    //   sideItems:[{sideItemId:"GKWF3lfHwv47JW87x41U",count:2}],
    //   address:"19 simmons blvd",
    //   currentStatus:"Pending to deliver",
    //   deliveryDate:Date.now().toString(),
    //   driverId:"driverId",
    // }).then((result)=>console.log(result)).catch((error)=>console.log(error))
});
//test()
//getUser("6JwbGWEL1DUWSv11GlLAdMm9EQn2").then((result)=>console.log(result))
//createUser({email:"harry1@gmail.com",password:"password"},{email:"harry1@gmail.com"}).then((r)=>console.log(r)).catch((s)=>console.log("error"))
//getUser("uid").then((x)=>console.log(x))
//signIn("harkiratsingh.tu@gmail.com","password123").then((x)=>console.log(x)).catch((e)=>console.log(e))
