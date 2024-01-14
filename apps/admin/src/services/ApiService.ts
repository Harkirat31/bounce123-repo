import { DriverType, OrderType, PathOrderType, RentingItemType, UserType } from "types";
import { BASE_URL } from "../../config";
import axios from "axios";


export const signupAPI = (user: UserType) => {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + '/auth/createUser', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        }).then((response) => response.json().then((jsonData) => {
            resolve(jsonData)
        }).catch((error) => reject(error))).catch((error) => {
            reject(error)
        })
    })
}
export const updateUserAPI = (user: UserType) => {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + '/admin/updateUser', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(user)
        }).then((response) => response.json().then((jsonData) => {
            resolve(jsonData)
        }).catch((error) => reject(error))).catch((error) => {
            reject(error)
        })
    })
}

export const signInAPI = (email: string, password: string) => {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + '/auth/signin', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        }).then((response) => response.json().then((jsonData) => {
            console.log(jsonData)
            resolve(jsonData)
        }).catch((error) => reject(error))).catch((error) => {
            reject(error)
        })
    })
}

export const getUserAPI = () => {
    return new Promise((resolve, reject) => {
        const urlGetPaths = `${BASE_URL}/admin/getUser`
        fetch(urlGetPaths, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
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

export const getRentingItemsAPI = () => {
    return new Promise((resolve, reject) => {
        const urlGetRentingItems = `${BASE_URL}/admin/getRentingItems`
        fetch(urlGetRentingItems, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
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
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
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
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
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

export const deleteDriver = (driverId: string) => {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + '/admin/deleteDriver', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ driverId })
        }).then((response) => response.json().then((jsonData) => {
            if (response.status == 200) {
                resolve({ isDeleted: true })
            }
            else {
                reject({ isDeleted: false })
            }
        }).catch((error) => reject(error))).catch((error) => {
            reject({ isDeleted: false })
        })
    })
}


export const getOrdersAPI = (date: Date) => {
    const urlGetOrders = `${BASE_URL}/admin/getOrders`;
    return new Promise((resolve, reject) => {
        axios.post(
            urlGetOrders,
            { date: date },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                timeout: 6000
            },

        )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};


export const getPathsAPI = (date: Date) => {
    return new Promise((resolve, reject) => {
        const urlGetPaths = `${BASE_URL}/admin/getPaths`
        fetch(urlGetPaths, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ date: date })
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

export const createPath = (path: PathOrderType) => {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + '/admin/createPath', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(path)
        }).then((response) => response.json().then((jsonData) => {
            if (response.status == 200) {
                resolve(jsonData)
            }
            else {
                reject("error")
            }
        }).catch((error) => reject(error))).catch((error) => {
            reject(error)
        })
    })
}


export const createOrder = (order: OrderType) => {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + '/admin/createOrder', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(order)
        }).then((response) => response.json().then((jsonData) => {
            resolve(jsonData)
        }).catch((error) => reject(error))).catch((error) => {
            reject(error)
        })
    })
}

export const assignPathAPI = (path: PathOrderType) => {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + '/admin/assignPath', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(path)
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
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
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
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
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

export const changePriority = (orderId: string, priority: string) => {
    return new Promise((resolve, reject) => {
        const urlAssignOrder = `${BASE_URL}/admin/changePriority`

        let params = { orderId: orderId, priority: priority }
        fetch(urlAssignOrder, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(params)
        }).then((response) => response.json().then((jsonData) => {
            console.log(jsonData)
            if (jsonData.isAdded == true) {
                resolve({ isAdded: true })
            }
            else {
                reject({ isAdded: false })
            }
        })).catch((_) => {
            reject({ isAdded: false })
        })
    })
}


export const assignDriver = (orderId: string, driverId: string, driverName: string) => {
    return new Promise((resolve, reject) => {
        const urlAssignOrder = `${BASE_URL}/admin/assignOrder`

        let params = { orderId: orderId, driverId: driverId, driverName: driverName }
        fetch(urlAssignOrder, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(params)
        }).then((response) => response.json().then((jsonData) => {
            console.log(jsonData)
            if (jsonData.isAdded == true) {
                resolve({ isAdded: true })
            }
            else {
                reject({ isAdded: false })
            }
        })).catch((_) => {
            reject({ isAdded: false })
        })
    })
}

export const createDriver = (driverData: DriverType) => {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + '/admin/createDriver', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(driverData)
        }).then((response) => response.json().then((jsonData) => {
            resolve(jsonData)
        })).catch((result) => {
            reject(result)
        })
    })

}

export const deleteOrders = (orders: any[]) => {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + '/admin/deleteOrders', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ orders: orders })
        }).then((response) => response.json().then((jsonData) => {
            resolve(jsonData)
        })).catch((result) => {
            reject(result)
        })
    })
}

export const deletePath = (path: any) => {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + '/admin/deletePath', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(path)
        }).then((response) => response.json().then((jsonData) => {
            resolve(jsonData)
        })).catch((result) => {
            reject(result)
        })
    })
}