import {z} from "zod"

export const rentingItem =z.object({
    rentingItemId:z.number(),
    title:z.string(),
    deliveryPrice:z.number(),
    capacity:z.number()
})

export type rentingItemType = z.infer<typeof rentingItem>

export const sideItem = z.object({
    sideItemId:z.number(),
    title:z.string(),
    capacity:z.number()
})

export type sideItemType = z.infer<typeof sideItem>

export const driver = z.object({
    driverId:z.number(),
    driverName:z.string(),
    contact:z.string(),
    email:z.string().email()
})
export type driverType = z.infer<typeof driver>


export const location = z.object({
    address:z.string(),
    lat:z.string(),
    long:z.string()
})

export const order = z.object({
    orderId: z.number(),
    rentingItem:rentingItem,
    //order contains array of side items with their respective count, for example bounce castle may need two blowers, two tarps underneath
    sideItems:z.array(z.object({sideItem:sideItem,count:z.number()})),
    location:location,
    driver:driver,
    deliveryDate:z.string().datetime()
})

export type orderType = z.infer<typeof order>

