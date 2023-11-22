import { DefaultValue, atom, atomFamily, selector, selectorFamily } from "recoil";
import { PathOrderType } from "types";
import { getOrder } from "../selectors/orderSelector";


export const createPathAtom = atom<(string)[]>({
    key: "createPathAtom",
    default: []
})

export const savedPathsAtom = atom<PathOrderType[]>({
    key: "getPaths",
    default: []
})

export const savedPaths = selector<PathOrderType[]>({
    key: "savedPathsSelector",
    get: ({ get }) => {
        return get(savedPathsAtom)
    },
    set: ({ set, get }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            newValue.forEach((path) => {
                path.path.forEach((orderId) => {
                    let order = get(getOrder(orderId))
                    if (order!.assignedPathId == null || order!.assignedPathId == "") {
                        set(getOrder(orderId), { ...order!, assignedPathId: path.pathId, currentStatus: "PathAssigned" })
                    }
                })
            })
            set(savedPathsAtom, newValue)
        }
        else {
            set(savedPathsAtom, newValue)
        }
    }
})



export const getSavedPathById = atomFamily({
    key: `getPath`,
    default: selectorFamily({
        key: "getPath/Default",
        get: (pathId: string) => ({ get }) => {
            const paths = get(savedPaths)
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
            let allPaths = get(savedPaths)
            let filteredOrderIds = newValue.filter((orderId) => {
                let resultOrderId = true
                allPaths.forEach((path1) => {
                    console.log("Alredy there")
                    path1.path.forEach((id) => {
                        if (id === orderId) {
                            resultOrderId = false
                        }
                    })
                })
                return resultOrderId
            })
            set(orderSetForAtom, filteredOrderIds)

        }
        else {
            set(orderSetForAtom, newValue)
        }

    }
})

