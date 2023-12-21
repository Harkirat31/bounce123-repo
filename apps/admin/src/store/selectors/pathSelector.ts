import { DefaultValue, selectorFamily } from "recoil";
import { getSavedPathById, } from "../atoms/pathAtom";
import { getOrder } from "./orderSelector";
import { OrderType } from "types";




export const getPathById = selectorFamily({
    key: 'getPathThroughId',
    get: (id: string) => ({ get }) => {
        let path = get(getSavedPathById(id))
        return path;
    },

    set: (id: string) => ({ get, set }, newValue) => {
        let pathState = get(getSavedPathById(id))

        set(getSavedPathById(id), newValue);

        if (!(newValue instanceof DefaultValue)) {
            let oldPathSet = new Set(pathState?.path)
            let newPathSet = new Set(newValue?.path)
            newValue?.path.forEach((pathNode) => {
                let order = get(getOrder(pathNode))
                set(getOrder(pathNode), { ...order, driverId: newValue.driverId, driverName: newValue.driverName, currentStatus: "SentToDriver" } as OrderType)
            })
            //set difference
            newPathSet.forEach((value) => {
                if (oldPathSet.has(value)) {
                    oldPathSet.delete(value)
                }
            })
            //change status to not assigned
            oldPathSet.forEach((pathNode) => {
                let order = get(getOrder(pathNode))
                set(getOrder(pathNode), { ...order, currentStatus: "NotAssigned" } as OrderType)
            })

        }

    },
});