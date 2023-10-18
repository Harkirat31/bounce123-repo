import { z } from "zod"

export const userId = z.object({ uid: z.string() })

export const rentingItem = z.object({
    companyId: z.string().optional(),
    rentingItemId: z.string().optional(),
    title: z.string().min(1),
    category: z.string().min(1),
    deliveryPrice: z.number(),
    capacity: z.number(),
    //order contains array of side items with their respective count, for example bounce castle may need two blowers, two tarps underneath
    sideItems: z.array(z.object({ sideItemId: z.string(), sideItemTitle: z.string(), count: z.number() })),
})

export type RentingItemType = z.infer<typeof rentingItem>

export const rentingItems = z.array(rentingItem)
export type RentingItemsType = z.infer<typeof rentingItems>

export const sideItem = z.object({
    companyId: z.string().optional(),
    sideItemId: z.string().optional(),
    title: z.string(),
    capacity: z.number()
})

export type SideItemType = z.infer<typeof sideItem>

export const location = z.object({
    lat: z.string(),
    long: z.string()
})

export type LocationType = z.infer<typeof location>


export const userSignIn = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

export type UserSignInType = z.infer<typeof userSignIn>

export const driver = z.object({
    companyId: z.string().optional(),
    email: z.string(),
    name: z.string(),
    uid: z.string().optional(),
    role: z.string().optional(),
    phone: z.string(),
    vehicleStyle: z.string(),
    vehicleCapacity: z.number(),
    currentLocation: location.optional(),
    isAutomaticallyTracked: z.boolean().default(false)
})

export type DriverType = z.infer<typeof driver>

export const order = z.object({
    companyId: z.string().optional(),
    orderId: z.number().optional(),
    rentingItems: z.array(z.object({ rentingItemId: z.string(), rentingItemTitle: z.string() })),
    address: z.string(),
    location: location,
    driverId: z.string(),
    driverName: z.string(),
    currentStatus: z.string(), //weather deliverd, picked, pending to deliver, pending to pick
    deliveryDate: z.string(),
    extraItems: z.array(z.object({ sideItemId: z.string(), sideItemTitle: z.string(), count: z.number() })).optional(),
})

export type OrderType = z.infer<typeof order>


export const assignOrder = z.object({
    driverId: z.string(),
    orderId: z.string()
})

export const updateLocation = z.object({
    driverId: z.string(),
    currentLocation: location
})

export const updateStatusOfOrder = z.object({
    orderId: z.string(),
    currentStatus: z.string()
})

//export const 
