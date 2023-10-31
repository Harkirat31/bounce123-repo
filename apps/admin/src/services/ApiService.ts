import { OrderType, RentingItemType } from "types";
import { BASE_URL } from "../../config";

export const getRentingItemsAPI = () => {
    return new Promise((resolve, reject) => {
        const urlGetRentingItems = `${BASE_URL}/admin/getRentingItems`
        fetch(urlGetRentingItems, {
            method: "GET"
        }).then(result => {
            result.json().then(
                (jsonData) => {
                    resolve(jsonData)
                }
            ).catch((error) => {
                reject(error)
            })
        }).catch((error) => reject(error))
    })
}

export const getSideItemsAPI = () => {
    return new Promise((resolve, reject) => {
        const urlGetSideItems = `${BASE_URL}/admin/getSideItems`
        fetch(urlGetSideItems, {
            method: "GET"
        }).then(result => {
            result.json().then(
                (jsonData) => {
                    resolve(jsonData)
                }
            ).catch((error) => {
                reject(error)
            })
        }).catch((error) => reject(error))
    })
}

export const getDriversAPI = () => {
    return new Promise((resolve, reject) => {
        const urlGetDrivers = `${BASE_URL}/admin/getDrivers`
        fetch(urlGetDrivers, {
            method: "GET"
        }).then(result => {
            result.json().then(
                (jsonData) => {
                    resolve(jsonData)
                }
            ).catch((error) => {
                reject(error)
            })
        }).catch((error) => reject(error))
    })
}

export const getOrdersAPI = () => {
    return new Promise((resolve, reject) => {
        const urlGetOrders = `${BASE_URL}/admin/getOrders`
        let dateNow = new Date().setUTCHours(0, 0, 0, 0)
        console.log(dateNow)
        fetch(urlGetOrders, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: dateNow })
        }).then(result => {
            result.json().then(
                (jsonData) => {
                    resolve(jsonData)
                }
            ).catch((error) => {
                reject(error)
            })
        }).catch((error) => reject(error))
    })
}

export const createOrder = (order: OrderType) => {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + '/admin/createOrder', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        }).then((response) => response.json().then((jsonData) => {
            resolve(jsonData)
        }).catch((error) => reject(error))).catch((error) => {
            reject(error)
        })
    })
}

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
export const createMainItemsApi = (orders: RentingItemType[]) => {
    let createItemsStatuses: any = []

    return new Promise(async (resolve, reject) => {
        let iteratedElements = 0
        orders.forEach(async (item, index) => {
            fetch(BASE_URL + '/admin/createRentingItem', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            }).then((response) => response.json().then((jsonData) => {
                iteratedElements = index + 1
                if (jsonData.isAdded) {
                    createItemsStatuses.push({ orderNumber: item.title, success: true })
                } else {
                    createItemsStatuses.push({ orderNumber: item.title, success: false })
                }
            })).catch(() => {
                createItemsStatuses.push({ orderNumber: item.title, success: false })
            }).finally(() => {
                if (iteratedElements == orders.length) {
                    resolve(createItemsStatuses)
                }
            })
        })


    })


}