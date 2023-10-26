import { selector } from "recoil";
import { ordersAtom, } from "../atoms/orderAtom"

export const getOrders = selector({
    key: "getOrders",
    get: ({ get }) => {
        const state = get(ordersAtom)
        return state
    }
})

