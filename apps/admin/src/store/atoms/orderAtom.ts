import { atom } from "recoil"
import { OrderType } from "types"

type ordersStateType = {
    isLoading: boolean,
    date: number,
    value: OrderType[]
}


export const ordersState = atom<ordersStateType>({
    key: "ordersState",
    default: {
        isLoading: true,
        date: new Date().setHours(0, 0, 0, 0),
        value: []
    }
})

