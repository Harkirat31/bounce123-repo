import { atom, useRecoilState } from "recoil"
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

export const getOrderById = (id: string) => {
    const [orders] = useRecoilState(ordersAtom)
    let order = orders.find((order) => id === order.orderId)
    return atom({
        key: `order${id}`,
        default: order
    })
}

