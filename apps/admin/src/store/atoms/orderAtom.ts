import { atom } from "recoil"
import { OrderType } from "types"



export const ordersAtom = atom<OrderType[]>({
    key: "orderState",
    default: []
})



export const ordersSearchDate = atom({
    key: "ordersSearchDate",
    default: new Date()
})


