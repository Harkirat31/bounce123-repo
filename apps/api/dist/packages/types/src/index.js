"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusOfOrder = exports.updateLocation = exports.assignOrder = exports.order = exports.user = exports.userSignIn = exports.location = exports.sideItem = exports.rentingItems = exports.rentingItem = exports.userId = void 0;
const zod_1 = require("zod");
exports.userId = zod_1.z.object({ uid: zod_1.z.string() });
exports.rentingItem = zod_1.z.object({
    rentingItemId: zod_1.z.string().optional(),
    title: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    deliveryPrice: zod_1.z.number(),
    capacity: zod_1.z.number(),
    //order contains array of side items with their respective count, for example bounce castle may need two blowers, two tarps underneath
    sideItems: zod_1.z.array(zod_1.z.object({ sideItemId: zod_1.z.string(), sideItemTitle: zod_1.z.string(), count: zod_1.z.number() })),
});
exports.rentingItems = zod_1.z.array(exports.rentingItem);
exports.sideItem = zod_1.z.object({
    sideItemId: zod_1.z.string().optional(),
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
    uid: zod_1.z.string().optional(),
    role: zod_1.z.string(),
    phone: zod_1.z.string(),
    vehicleStyle: zod_1.z.string(),
    vehicleCapacity: zod_1.z.number(),
    currentLocation: exports.location.optional(),
    isAutomaticallyTracked: zod_1.z.boolean().default(false)
});
exports.order = zod_1.z.object({
    orderId: zod_1.z.number().optional(),
    rentingItems: zod_1.z.array(zod_1.z.object({ rentingItemId: zod_1.z.string(), rentingItemTitle: zod_1.z.string() })),
    address: zod_1.z.string(),
    location: exports.location,
    driverId: zod_1.z.string(),
    driverName: zod_1.z.string(),
    currentStatus: zod_1.z.string(),
    deliveryDate: zod_1.z.string(),
    extraItems: zod_1.z.array(zod_1.z.object({ sideItemId: zod_1.z.string(), sideItemTitle: zod_1.z.string(), count: zod_1.z.number() })).optional(),
});
exports.assignOrder = zod_1.z.object({
    driverId: zod_1.z.string(),
    orderId: zod_1.z.string()
});
exports.updateLocation = zod_1.z.object({
    driverId: zod_1.z.string(),
    currentLocation: exports.location
});
exports.updateStatusOfOrder = zod_1.z.object({
    orderId: zod_1.z.string(),
    currentStatus: zod_1.z.string()
});
//export const 
