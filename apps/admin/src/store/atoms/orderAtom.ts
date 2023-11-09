import { atom, useRecoilState } from "recoil"
import { OrderType } from "types"



export const ordersAtom = atom<OrderType[]>({
    key: "orderState",
    default: []
})

export const getOrdersIdsAtom = () => {
    const [orders] = useRecoilState(ordersAtom)
    let ordersIds = orders.map((order) => order.orderId)
    return atom({
        key: "ordersIds",
        default: [...ordersIds]
    })
}

export const ordersSearchDate = atom({
    key: "ordersSearchDate",
    default: new Date()
})

export const getOrderById = (id: string) => {
    const [orders] = useRecoilState(ordersAtom)
    let order = orders.find((order) => id === order.orderId)
    return atom({
        key: `order${id}`,
        default: order
    })
}

