import {z} from "zod"

export const rentingItem =z.object({
    rentingItemId:z.number(),
    title:z.string(),
    deliveryPrice:z.number(),
    capacity:z.number()
})

export type RentingItemType = z.infer<typeof rentingItem>

export const sideItem = z.object({
    sideItemId:z.number(),
    title:z.string(),
    capacity:z.number()
})

export type SideItemType = z.infer<typeof sideItem>

export const driver = z.object({
    driverId:z.number(),
    driverName:z.string(),
    contact:z.string(),
    email:z.string().email()
})
export type DriverType = z.infer<typeof driver>


export const location = z.object({
    address:z.string(),
    lat:z.string(),
    long:z.string()
})

export type LocationType=z.infer<typeof location>

export const order = z.object({
    orderId: z.number(),
    rentingItem:rentingItem,
    //order contains array of side items with their respective count, for example bounce castle may need two blowers, two tarps underneath
    sideItems:z.array(z.object({sideItem:sideItem,count:z.number()})),
    location:location,
    driver:driver,
    deliveryDate:z.string().datetime()
})

export type OrderType = z.infer<typeof order>

export const userSignIn = z.object({
    email: z.string().email(),
    password:z.string().min(1)
})

export type UserSignInType = z.infer<typeof userSignIn>

export const user = z.object({
    email: z.string(),
    name:z.string(),
    uid:z.string(),
    role:z.string(),
    phone:z.string(),
    vehicleStyle:z.string(),
    vehicleCapacity:z.number(),
})

export type UserType = z.infer<typeof user>
