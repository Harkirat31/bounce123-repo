import { OrderType } from "types";


export const handleOrdersUpdate = (orders: OrderType[], setOrders: any, setOrdersIds: any) => {
    setOrders(orders)
    let ids = orders.map((order) => order.orderId)
    setOrdersIds(ids)
}