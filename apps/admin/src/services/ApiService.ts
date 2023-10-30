import { OrderType } from "types";
import { BASE_URL } from "../../config";

export const createOrdersApi = (orders: OrderType[]) => {
    let createOrderStatuses: any = []

    return new Promise(async (resolve, reject) => {
        let iteratedElements = 0
        orders.forEach(async (order, index) => {
            fetch(BASE_URL + '/admin/createOrder', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            }).then((response) => response.json().then((jsonData) => {
                iteratedElements = index + 1
                if (jsonData.isAdded) {
                    createOrderStatuses.push({ orderNumber: order.orderNumber, success: true })
                } else {
                    createOrderStatuses.push({ orderNumber: order.orderNumber, success: false })
                }
            })).catch(() => {
                createOrderStatuses.push({ orderNumber: order.orderNumber, success: false })
            }).finally(() => {
                if (iteratedElements == orders.length) {
                    resolve(createOrderStatuses)
                }
            })
        })


    })


}