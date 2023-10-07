"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignIn = exports.order = exports.location = exports.driver = exports.sideItem = exports.rentingItem = void 0;
const zod_1 = require("zod");
exports.rentingItem = zod_1.z.object({
    rentingItemId: zod_1.z.number(),
    title: zod_1.z.string(),
    deliveryPrice: zod_1.z.number(),
    capacity: zod_1.z.number()
});
exports.sideItem = zod_1.z.object({
    sideItemId: zod_1.z.number(),
    title: zod_1.z.string(),
    capacity: zod_1.z.number()
});
exports.driver = zod_1.z.object({
    driverId: zod_1.z.number(),
    driverName: zod_1.z.string(),
    contact: zod_1.z.string(),
    email: zod_1.z.string().email()
});
exports.location = zod_1.z.object({
    address: zod_1.z.string(),
    lat: zod_1.z.string(),
    long: zod_1.z.string()
});
exports.order = zod_1.z.object({
    orderId: zod_1.z.number(),
    rentingItem: exports.rentingItem,
    //order contains array of side items with their respective count, for example bounce castle may need two blowers, two tarps underneath
    sideItems: zod_1.z.array(zod_1.z.object({ sideItem: exports.sideItem, count: zod_1.z.number() })),
    location: exports.location,
    driver: exports.driver,
    deliveryDate: zod_1.z.string().datetime()
});
exports.userSignIn = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string().min(1)
});
