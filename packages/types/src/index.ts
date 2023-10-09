import {z} from "zod"

export const userId =z.object({uid:z.string()}) 

export const rentingItem =z.object({
    rentingItemId:z.number(),
    title:z.string(),
    category:z.string(),
    deliveryPrice:z.number(),
    capacity:z.number()
})

export type RentingItemType = Partial<z.infer<typeof rentingItem>>

export const sideItem = z.object({
    sideItemId:z.number(),
    title:z.string(),
    capacity:z.number()
})

export type SideItemType = Partial<z.infer<typeof sideItem>>

export const location = z.object({
    lat:z.string(),
    long:z.string()
})

export type LocationType=Partial<z.infer<typeof location>>


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
    currentLocation:location,
    isAutomaticallyTracked:z.boolean() 
})

export type UserType = Partial<z.infer<typeof user>>


export const order = z.object({
    orderId: z.number(),
    rentingItemId:z.string(),
    //order contains array of side items with their respective count, for example bounce castle may need two blowers, two tarps underneath
    sideItems:z.array(z.object({sideItemId:z.string(),count:z.number()})),
    address:z.string(),
    location:location,
    driverId:z.string(),
    currentStatus:z.string(), //weather deliverd, picked, pending to deliver, pending to pick
    deliveryDate:z.string().datetime()

})

export type OrderType = Partial<z.infer<typeof order>>
