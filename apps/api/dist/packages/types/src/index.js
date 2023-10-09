"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.order = exports.user = exports.userSignIn = exports.location = exports.sideItem = exports.rentingItem = exports.userId = void 0;
const zod_1 = require("zod");
exports.userId = zod_1.z.object({ uid: zod_1.z.string() });
exports.rentingItem = zod_1.z.object({
    rentingItemId: zod_1.z.number(),
    title: zod_1.z.string(),
    category: zod_1.z.string(),
    deliveryPrice: zod_1.z.number(),
    capacity: zod_1.z.number()
});
exports.sideItem = zod_1.z.object({
    sideItemId: zod_1.z.number(),
    title: zod_1.z.string(),
    capacity: zod_1.z.number()
});
exports.location = zod_1.z.object({
    lat: zod_1.z.string(),
    long: zod_1.z.string()
});
exports.userSignIn = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1)
});
exports.user = zod_1.z.object({
    email: zod_1.z.string(),
    name: zod_1.z.string(),
    uid: zod_1.z.string(),
    role: zod_1.z.string(),
    phone: zod_1.z.string(),
    vehicleStyle: zod_1.z.string(),
    vehicleCapacity: zod_1.z.number(),
    currentLocation: exports.location,
    isAutomaticallyTracked: zod_1.z.boolean()
});
exports.order = zod_1.z.object({
    orderId: zod_1.z.number(),
    rentingItemId: zod_1.z.string(),
    //order contains array of side items with their respective count, for example bounce castle may need two blowers, two tarps underneath
    sideItems: zod_1.z.array(zod_1.z.object({ sideItemId: zod_1.z.string(), count: zod_1.z.number() })),
    address: zod_1.z.string(),
    location: exports.location,
    driverId: zod_1.z.string(),
    currentStatus: zod_1.z.string(),
    deliveryDate: zod_1.z.string().datetime()
});
