import { OrderType, PathOrderType } from "types";
import { PathModel } from "../models/pathModel";
import mongoose from "mongoose";
import { OrderModel } from "../models/orderModel";
import { notEqual } from "assert";

export const createPath = (newPath: PathOrderType) => {
    return new Promise(async (resolve, reject) => {
        try {
            //this should be transaction, add transaction
            //all added orders status changed to PathAssigned
            const result = await PathModel.create(newPath)
            for (const order of newPath.path) {
                await OrderModel.updateOne({ _id: order.id }, {
                    assignedPathId: result.id,
                    currentStatus: "PathAssigned",
                })
            }
            resolve("Success")

        }
        catch (error: any) {
            reject("Error " + error.toString())
        }

    })
}

export const getPathswithDate = (date: Date, companyId: string): Promise<PathOrderType[]> => {
    return new Promise((resolve, reject) => {
        PathModel.find({
            companyId: companyId,
            dateOfPath: date
        }).then((result) => {
            let paths = result.map(
                (doc) => {
                    let path = doc as PathOrderType
                    path.dateOfPath = doc.dateOfPath
                    path.pathId = doc.id
                    return path
                }
            )
            resolve(paths)
        }).catch((error) => reject(new Error("Error fetching paths")))
    })
}


export const updatePath = (newPath: PathOrderType) => {
    return new Promise(async (resolve, reject) => {
        try {
            let oldPath = await PathModel.findById(newPath.pathId!) as PathOrderType
            let oldPathSet = new Set(oldPath.path)
            let newPathSet = new Set(newPath.path)
            //delete nodes which are not in new path

            //set difference
            newPathSet.forEach((value) => {
                if (oldPathSet.has(value)) {
                    oldPathSet.delete(value)
                }
            })
            //change status to not assigned

            for (const pathNode of oldPathSet) {
                await OrderModel.updateOne({
                    _id: pathNode.id
                }, {
                    assignedPathId: "",
                    currentStatus: "NotAssigned"
                })
            }
            await PathModel.updateOne({ _id: newPath.pathId! }, { ...newPath })

            for (const order of newPath.path) {
                await OrderModel.updateOne({ _id: order.id }, {
                    assignedPathId: newPath.pathId!,
                    currentStatus: "PathAssigned",
                })
            }
            resolve("Success")

        }
        catch {
            reject("Error")
        }

    })
}


export const deletePath = (path: PathOrderType) => {
    return new Promise(async (resolve, reject) => {
        try {
            await PathModel.deleteOne({
                _id: path.pathId
            })
            for (const order of path.path) {
                await OrderModel.findByIdAndUpdate(order.id, {
                    $set: {
                        currentStatus: "NotAssigned",
                    },
                    $unset: {
                        assignedPathId: "",
                        driverId: "",
                        driverName: ""
                    }
                })
            }
            resolve("Success")

        }
        catch (error: any) {
            reject("Error " + error.toString())
        }

    })
}


export const assignPathToDriver = (path: PathOrderType) => {
    return new Promise((resolve, reject) => {

        PathModel.updateOne({ _id: path.pathId }, {
            driverId: path.driverId,
            driverName: path.driverName,
        }).then(async (result) => {
            for (const pathNode of path.path) {
                await OrderModel.updateOne({ _id: pathNode.id }, {
                    driverId: path.driverId,
                    driverName: path.driverName,
                    currentStatus: "SentToDriver"
                })
            }
            resolve(result)
        }).catch((error) => {
            reject(new Error("Error"))
        })
    })
}


export const assignOrderAndPath = (newPath: PathOrderType) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await PathModel.create(newPath)
            for (const order of newPath.path) {
                await OrderModel.updateOne({ _id: order.id }, {
                    assignedPathId: result.id,
                    driverId: newPath.driverId,
                    driverName: newPath.driverName,
                    currentStatus: "SentToDriver"
                })
            }
            resolve({ result: "Success", pathId: result.id })
        }
        catch {
            reject("Error")
        }
    })
}


export const cancelPath = (path: PathOrderType) => {
    return new Promise(async (resolve, reject) => {
        try {
            const nonDeliveredOrdersDocs = await OrderModel.find({
                assignedPathId: path.pathId,
                currentStatus: { $ne: "Delivered" }
            })
            // const nonDeliveredOrdersDocs = (await db.collection('orders').where("assignedPathId", "==", path.pathId).where("currentStatus", "!=", "Delivered").get()).docs
            const nonDeliveredOrders: OrderType[] = []
            const nonDeliveredOrderIds = new Set<string>()
            nonDeliveredOrdersDocs.forEach((doc) => {
                nonDeliveredOrders.push(doc as OrderType)
                nonDeliveredOrderIds.add(doc.id)
            })
            const modifiedPath = path.path.filter((p) => {
                if (nonDeliveredOrderIds.has(p.id)) {
                    return false
                }
                else {
                    return true
                }
            })


            for (const orderId of nonDeliveredOrderIds) {
                await OrderModel.findByIdAndUpdate(orderId, {
                    $set: {
                        currentStatus: "NotAssigned",
                    },
                    $unset: {
                        assignedPathId: "",
                        driverId: "",
                        driverName: ""
                    }
                })
            }

            //if modified path length is ZERO, delete path
            if (modifiedPath.length == 0) {
                await PathModel.findByIdAndDelete(path.pathId)
                resolve({ result: true, isPathDeleted: true })
            }
            else {
                await PathModel.findByIdAndUpdate(path.pathId, {
                    path: modifiedPath
                })
                resolve({ result: true, isPathDeleted: false, modifiedPath: modifiedPath })
            }
        }
        catch (error) {
            console.log(error)
            reject({ result: false, isPathDeleted: false })
        }

    })
}



export const updatePathGemetry = (newPath: PathOrderType) => {
    return new Promise(async (resolve, reject) => {
        try {
            await PathModel.findByIdAndUpdate(newPath.pathId, {
                pathGeometry: newPath.pathGeometry
            })
            resolve("Success")
        }
        catch {
            reject("Error")
        }

    })
}


export const updateNextOrderOfPath = (pathId: string, orderId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            await PathModel.findByIdAndUpdate(pathId, {
                nextOrderToBeDelivered: orderId
            })
            resolve("Success")
        }
        catch {
            reject("Error")
        }

    })
}

export const removeNextOrderOfPath = (pathId: string, orderId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            await PathModel.findByIdAndUpdate(pathId,
                {
                    $unset: { nextOrderToBeDelivered: "" }
                },)
            resolve("Success")
        }
        catch {
            reject("Error")
        }

    })
}






