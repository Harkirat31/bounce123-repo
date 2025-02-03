import { DefaultValue, atom, atomFamily, selector, selectorFamily } from "recoil";
import { LocationType, OrderType, PathOrderType } from "types";
import { getOrder } from "../selectors/orderSelector";


export const createPathAtom = atom<{ path: {id:string,latlng?:LocationType}[], pathId: string | undefined }>({
    key: "createPathAtom",
    default: { path: [], pathId: undefined }
})

export const savedPathsAtom = atom<PathOrderType[]>({
    key: "getPaths",
    default: []
})

// export const savedPaths = selector<PathOrderType[]>({
//     key: "savedPathsSelector",
//     get: ({ get }) => {
//         return get(savedPathsAtom)
//     },
//     set: ({ set, get }, newValue) => {
//         if (!(newValue instanceof DefaultValue)) {
//             console.log("Lol")
//             newValue.forEach((path) => {
//                 path.path.forEach((pathNode) => {
//                     let order = get(getOrder(pathNode.id))
//                     if (order!.assignedPathId == null || order!.assignedPathId == "") {
//                         set(getOrder(pathNode.id), { ...order!, assignedPathId: path.pathId, currentStatus: "PathAssigned" })
//                     }
//                 })
//             })
//             set(savedPathsAtom, newValue)
//         }
//         else {
//             set(savedPathsAtom, newValue)
//         }
//     }
// })



export const getSavedPathById = atomFamily({
    key: `getPath`,
    default: selectorFamily({
        key: "getPath/Default",
        get: (pathId: string) => ({ get }) => {
            const paths = get(savedPathsAtom)
            return paths.find((path) => path.pathId === pathId)
        }
    })
})

export const orderSetForAtom = atom<string[]>({
    key: "orderSetForAtom",
    default: []
})

export const orderSetForPathCreation = selector({
    key: "orderSetForPath",
    get: ({ get }) => {
        return get(orderSetForAtom)
    },
    set: ({ set, get }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            let filteredOrderIds = newValue.filter((orderId) => {
                return true ? get(getOrder(orderId))!.currentStatus == "NotAssigned" : false
            })
            set(orderSetForAtom, filteredOrderIds)

        }
        else {
            set(orderSetForAtom, newValue)
        }

    }
})

//update after undo
export const updateOrders = selector<string[]>({
    key: "updateOrders",
    get: ({ get }) => {
        return []
    },
    set: ({ set, get }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            newValue.forEach((orderId) => {
                let order = { ...get(getOrder(orderId)) }
                order!.currentStatus = "NotAssigned"
                order!.assignedPathId = ""
                order!.driverId = undefined
                order!.driverName = undefined
                set(getOrder(orderId), { ...order as OrderType })
            })

        }

    }
})


export const updateOrdersAfterCancel = selector<string[]>({
    key: "updateOrdersAfterCancel",
    get: ({ get }) => {
        return []
    },
    set: ({ set, get }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            newValue.forEach((orderId) => {
                let order = { ...get(getOrder(orderId)) }
                if (order!.currentStatus != "Delivered") {
                    order!.currentStatus = "NotAssigned"
                    order!.assignedPathId = ""
                    order!.driverId = undefined
                    order!.driverName = undefined
                    set(getOrder(orderId), { ...order as OrderType })
                }
            })

        }

    }
})

