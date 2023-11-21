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
        if (!(newValue instanceof DefaultValue) && pathState?.show != newValue?.show) {
            set(getSavedPathById(id), newValue);
        }
        else {
            set(getSavedPathById(id), newValue);
            if (!(newValue instanceof DefaultValue)) {
                newValue?.path.forEach((pathNode) => {
                    let order = get(getOrder(pathNode))
                    set(getOrder(pathNode), { ...order, driverId: newValue.driverId, driverName: newValue.driverName, currentStatus: "SentToDriver" } as OrderType)
                })
            }
        }

    },
});