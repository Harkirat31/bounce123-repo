import { atom } from "recoil"
import { OrderType } from "types"

type ordersStateType = {
    isLoading: boolean,
    value: OrderType[]
}


export const ordersState = atom<ordersStateType>({
    key: "ordersState",
    default: {
        isLoading: true,
        value: []
    }
})

