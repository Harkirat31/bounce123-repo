import { optional, z } from "zod"




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
    lat: z.number(),
    lng: z.number()
})

export type LocationType = z.infer<typeof location>


export const userSignIn = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

export type UserSignInType = z.infer<typeof userSignIn>

export const driver = z.object({
    companyId: z.string().optional(),
    companyName: z.string().optional(),
    companyLocation: location.optional(),
    email: z.string().email(),
    name: z.string().min(1),
    uid: z.string().optional(),
    role: z.string().optional(),
    phone: z.string().min(10),
    vehicleStyle: z.string(),
    vehicleCapacity: z.string().min(1).optional(),
    currentLocation: location.optional(),
    isAutomaticallyTracked: z.boolean().default(false)
})

export type DriverType = z.infer<typeof driver>

export const order = z.object({
    companyId: z.string().optional(),
    assignedPathId: z.string().optional(),
    orderId: z.string().optional(),
    orderNumber: z.string().optional(),
    itemsDetail: z.string().optional(),
    cemail: z.string().email().optional(),
    rentingItems: z.array(z.object({ rentingItemId: z.string(), rentingItemTitle: z.string() })).optional(),
    address: z.string().min(1),
    cname: z.string().min(1),
    cphone: z.string().min(10),
    location: location.optional(),
    placeId: z.string().optional(),
    driverId: z.string().optional(),
    driverName: z.string().optional(),
    currentStatus: z.enum(["NotAssigned", "Assigned", "PathAssigned", "SentToDriver", "Accepted", "OnTheWay", "Delivered", "Picked", "Returned"]).default("NotAssigned"), //weather deliverd, picked, pending to deliver, pending to pick
    deliveryDate: z.date(),
    specialInstructions: z.string().optional(),
    deliverTimeRangeStart: z.number().min(1).max(24).optional(),
    deliverTimeRangeEnd: z.number().min(1).max(24).optional(),
    priority: z.enum(["High", "Medium", "Low", "Special"]).default("Medium"),
    extraItems: z.array(z.object({ sideItemId: z.string(), sideItemTitle: z.string(), count: z.number() })).optional(),
})

export type OrderType = z.infer<typeof order>


export const assignOrder = z.object({
    driverName: z.string(),
    driverId: z.string(),
    orderId: z.string()
})

export const changePriority = z.object({
    priority: z.string(),
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

export const updatePathAcceptance = z.object({
    pathId: z.string(),
    isAcceptedByDriver: z.boolean()
})

export enum deliveryStatus {
    NotAssigned,
    Assigned,
    PathAssigned,
    SentToDriver,
    OnTheWay,
    Accepted,
    Delivered,
    Picked,
    Returned,
}

export interface orderReferenceForPath{

}

export const pathGeometry = z.object({
    geometry:z.string().optional(),
    distanceInKm:z.number().optional(),
    durationInMins:z.number().optional()
})

export type PathGeometryType = z.infer<typeof pathGeometry>

export const pathOrder = z.object({
    pathId: z.string().optional(),
    companyId: z.string().optional(),
    startingLocation:location,
    show: z.boolean(),
    path: z.array(z.object({id:z.string(),latlng:location.optional()})),
    dateOfPath: z.date(),
    driverId: z.string().optional(),
    driverName: z.string().optional(),
    isAcceptedByDriver:z.boolean().optional(),
    pathGeometry:pathGeometry.optional()
})



export type PathOrderType = z.infer<typeof pathOrder>





export const notificationMessage = z.object({
    companyName: z.string(),
    message: z.string()
})

export type NotificationMessage = z.infer<typeof notificationMessage>

export const user = z.object({
    userId: z.string().optional(),
    password: z.string().min(8).optional(),
    email: z.string().email(),
    companyName: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().min(10),
    location: location.optional(),
    ordersCountForMonth: z.number().optional(),
    placeId: z.string().optional(),
    availableCount: z.number(),
    isApproved:z.boolean()
})
export type UserType = z.infer<typeof user>

export enum ErrorCode {
    AddressError,
    EmailAlreadyExist,
    WorngCredentials,
    MissisRequiredParams,
    DbError,
    MapsApiError,
    JsonParseError,
    WrongInputs,
    UserNotExists,
    EmailNotVerified,
    OrderLimitIncrease,
    UserNotApproved
}


