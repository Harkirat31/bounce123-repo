import { atomFamily, selector, selectorFamily } from "recoil";
import { ordersAtom, } from "../atoms/orderAtom"

export const getOrders = selector({
    key: "getOrders",
    get: ({ get }) => {
        const state = get(ordersAtom)
        return state
    }
})

export const getOrderIds = selector({
    key: "getOrderIds",
    get: ({ get }) => {
        const state = get(ordersAtom)
        let orderIds = state.map((order) => order.orderId)
        return orderIds
    }
})

export const getOrder = atomFamily({
    key: "getOrder",
    default: selectorFamily({
        key: "getOrder/Default",
        get: (orderId: string) => ({ get }) => {
            const orders = get(ordersAtom)
            return orders.find((order) => order.orderId === orderId)
        }
    })
})



