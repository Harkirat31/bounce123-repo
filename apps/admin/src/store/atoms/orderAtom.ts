import { atom } from "recoil"
import { OrderType } from "types"

type ordersStateType = {
    isLoading: boolean,
    date: Date,
    value: OrderType[]
}


export const ordersState = atom<ordersStateType>({
    key: "ordersState",
    default: {
        isLoading: true,
        date: new Date(),
        value: []
    }
})


export const ordersAtom = atom<OrderType[]>({
    key: "orderState",
    default: []
})

