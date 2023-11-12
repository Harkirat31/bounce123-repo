import { DefaultValue, atomFamily, selector, selectorFamily } from "recoil";
import { ordersAtom, } from "../atoms/orderAtom"
import { OrderType } from "types";

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

// export const getOrder = selectorFamily({
//     key: "getOrder",
//     get: (id: string) => ({ get }) => {
//         return getOrderAtom(id)
//     },
//     set: (id: string) => ({ get, set }, newValue) => {
//         set(getOrderAtom(id), newValue)
//         // if (!(newValue instanceof DefaultValue)) {
//         //     let orders = get(ordersAtom)
//         //     let ordersCopy = [...orders]
//         //     let index = ordersCopy.findIndex((order) => order.orderId === newValue!.orderId)
//         //     ordersCopy[index] = newValue as OrderType
//         //     set(ordersAtom, ordersCopy)
//         // }
//     },
// })



