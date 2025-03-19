// import { DefaultValue, selectorFamily } from "recoil";
// import { getSavedPathById, } from "../atoms/pathAtom";
// import { getOrder } from "./orderSelector";
// import { OrderType } from "types";

import { DefaultValue, selector } from "recoil"
import { getSavedPathById } from "../atoms/pathAtom"
import { PathOrderType } from "types"
import { realTimeUpdates } from "../atoms/updatesAtom"
import { getOrder } from "./orderSelector"




// export const getPathById = selectorFamily({
//     key: 'getPathThroughId',
//     get: (id: string) => ({ get }) => {
//         let path = get(getSavedPathById(id))
//         return path;
//     },

//     set: (id: string) => ({ get, set }, newValue) => {
//         let pathState = get(getSavedPathById(id))

//         set(getSavedPathById(id), newValue);

//         if (!(newValue instanceof DefaultValue)) {
//             let oldPathSet = new Set(pathState?.path)
//             let newPathSet = new Set(newValue?.path)

//             if (newValue!.driverId != undefined) {
//                 newValue?.path.forEach((pathNode) => {
//                     let order = get(getOrder(pathNode.id))
//                     set(getOrder(pathNode.id), { ...order, driverId: newValue.driverId, driverName: newValue.driverName, currentStatus: "SentToDriver" } as OrderType)
//                 })
//             }
//             if (newValue!.driverId == undefined || newValue!.driverId == null) {
//                 newValue?.path.forEach((node) => {
//                     let order = get(getOrder(node.id))
//                     set(getOrder(node.id), { ...order, currentStatus: "PathAssigned", assignedPathId: newValue.pathId } as OrderType)
//                 })
//                 //set difference to find deleted nodes and next updating their respective atom
//                 newPathSet.forEach((value) => {
//                     if (oldPathSet.has(value)) {
//                         oldPathSet.delete(value)
//                     }
//                 })
//                 //change status to not assigned
//                 oldPathSet.forEach((pathNode) => {
//                     let order = get(getOrder(pathNode.id))
//                     set(getOrder(pathNode.id), { ...order, currentStatus: "NotAssigned", assignedPathId: "" } as OrderType)
//                 })
//             }



//         }

//     },
// });


export const updatePathtoAccepted = selector<string | null>({
    key: "updatePathtoAccepted",
    get: ({ }) => { return null },
    set: ({ set, get }, newValue) => {
        if (typeof newValue == "string") {
            let path = get(getSavedPathById(newValue))
            if (path) {
                set(getSavedPathById(newValue), { ...path as PathOrderType,isAcceptedByDriver:true })
                let messages = get(realTimeUpdates)
                set(realTimeUpdates,[{ message: `${path!.driverName} has accepted the assigned deliveries route`, timeStamp: new Date() },...messages])
            }
            else{
                let messages = get(realTimeUpdates)
                set(realTimeUpdates,[{ message: `One Driver has accepted the assigned deliveries route`, timeStamp: new Date() },...messages])
            }
        }
    }
})

export const updatePathtoRejected = selector<string | null>({
    key: "updatePathtoRejected",
    get: ({ }) => { return null },
    set: ({ set, get }, newValue) => {
        if (typeof newValue == "string") {
            let path = get(getSavedPathById(newValue))
            if (path) {
                set(getSavedPathById(newValue), { ...path as PathOrderType,isAcceptedByDriver:false })
                let messages = get(realTimeUpdates)
                set(realTimeUpdates,[{ message: `${path!.driverName} has rejected the assigned deliveries route`, timeStamp: new Date() },...messages])
            }
            else{
                let messages = get(realTimeUpdates)
                set(realTimeUpdates,[{ message: `One Driver has rejected the assigned deliveries route`, timeStamp: new Date() },...messages])
            }
        }
    }
})

interface nextOrderUpdateType {
    orderId: string,
    pathId: string
}

export const updateNextOrderofPath = selector<nextOrderUpdateType | null>({
    key: "updateNextOrderofPath",
    get: ({ }) => { return null },
    set: ({ set, get }, newValue) => {

        if (newValue && !(newValue instanceof DefaultValue)) {
            let path = get(getSavedPathById(newValue.pathId))
            if(path){
                set(getSavedPathById(newValue.pathId),{...path,nextOrderToBeDelivered:newValue.orderId})
                let messages = get(realTimeUpdates)
                let order = get(getOrder(newValue.orderId))
                set(realTimeUpdates,[ { message: `${path!.driverName} is now moving to order ${order?.orderNumber}`, timeStamp: new Date() },...messages])
            }
            else{
                let messages = get(realTimeUpdates)
                set(realTimeUpdates,[ { message: `One Driver has changed his/her next order`, timeStamp: new Date() },...messages])
            }       

        }
    }
})