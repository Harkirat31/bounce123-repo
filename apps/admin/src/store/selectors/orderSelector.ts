import {  atomFamily, selector, selectorFamily } from "recoil";
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
    },
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

export const sortOrders = selectorFamily({
    key: "sortOrders",
    get: (sortBy: string) => ({ get }) => {
        return ""
    },
    set: (sortBy: string) => ({ get, set }, newValue) => {
        let ordersCopy = [...get(ordersAtom)]
        ordersCopy.sort((a, b) => {
            if (a.currentStatus == "NotAssigned"
                &&
                (
                    b.currentStatus == "NotAssigned"
                    ||
                    b.currentStatus == "SentToDriver"
                    ||
                    b.currentStatus == "Assigned"
                    ||
                    b.currentStatus == "OnTheWay"
                    ||
                    b.currentStatus == "Picked"
                    ||
                    b.currentStatus == "Returned"
                    ||
                    b.currentStatus == "Delivered"
                    ||
                    b.currentStatus == "PathAssigned"
                )
            ) {
                return -1
            }
            else {
                return 1
            }

        })

        set(ordersAtom, ordersCopy)
    },

})

// export const getOrder = selectorFamily({
//     key: "getOrder",
//     get: (id: string) => ({ get }) => {
//         const orders = get(ordersAtom)
//         return orders.find((order) => order.orderId === id)
//     },
//     set: (id: string) => ({ get, set }, newValue) => {
//         if (!(newValue instanceof DefaultValue)) {
//             let orders = get(ordersAtom)
//             let ordersCopy = [...orders]
//             let index = ordersCopy.findIndex((order) => order.orderId === newValue!.orderId)
//             ordersCopy[index] = newValue as OrderType
//             set(ordersAtom, ordersCopy)
//         }
//     },
// })



export const updateOrderStatusToDelivered = selector<string|null>({
    key:"updateOrderStatusToDelivered",
    get:({})=>{return null},
    set:({ set, get }, newValue)=>{
        if(typeof newValue =="string"){
            let order = { ...get(getOrder(newValue)) }
            order.currentStatus="Delivered"
            if(order){
                    set(getOrder(newValue), { ...order as OrderType })
            }
           
        }
    }
})

