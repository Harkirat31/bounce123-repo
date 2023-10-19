import { selector } from "recoil";
import { ordersState } from "../atoms/orderAtom"

export const getOrders = selector({
    key: "getOrders",
    get: ({ get }) => {
        const state = get(ordersState)
        return state.value
    }
})


