import { DefaultValue, selector, selectorFamily } from "recoil";
import { ordersAtom, } from "../atoms/orderAtom"

export const getOrders = selector({
    key: "getOrders",
    get: ({ get }) => {
        const state = get(ordersAtom)
        return state
    }
})

export const getOrderById = selectorFamily({
    key: "getOrderById",
    get: (id: string) => ({ get }) => {
        const orders = get(ordersAtom)
        const order = orders.find((order) => order.orderId === id)
        return order
    },
    set: (id: string) => ({ get, set }, newValue) => {
        const orders = get(ordersAtom)
        const orderIndex = orders.findIndex((order) => order.orderId === id)

        let newOrders = [...orders]

        if (newValue instanceof DefaultValue) {

        } else if (newValue === undefined) {

        }
        else {
            newOrders[orderIndex] = newValue
        }
        set(ordersAtom, newOrders)
    }
})

