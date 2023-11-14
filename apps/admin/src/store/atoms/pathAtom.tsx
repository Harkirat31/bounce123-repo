import { DefaultValue, atom, atomFamily, selector, selectorFamily } from "recoil";
import { PathOrderType } from "types";


export const createPathAtom = atom<(string)[]>({
    key: "createPathAtom",
    default: []
})

export const savedPaths = atom<PathOrderType[]>({
    key: "getPaths",
    default: []
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

