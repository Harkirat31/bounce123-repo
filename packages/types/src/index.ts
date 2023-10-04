import {z} from "zod"

export const rentingItem =z.object({
    title:z.string(),
    deliveryPrice:z.number(),
})
