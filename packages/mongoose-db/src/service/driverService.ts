import { OrderType, PathOrderType } from "types"
import { PathModel } from "../models/pathModel"
import { OrderModel } from "../models/orderModel"

export const getPathsOfDriverByDate =( driverId: string,date: Date):Promise<PathOrderType[]>=>{
     return new Promise((resolve, reject) => {   
          PathModel.find({
            driverId:driverId,
            dateOfPath:date
          }).then((docs)=>{
            let paths = docs.map((doc)=> {
              let path = doc as PathOrderType
              path.pathId = doc.id
              return path
            })

            resolve(paths)
          })
          .catch(() => reject(new Error("Error fetching orders of driver")))
        })
}

export const getOrdersOfDriverByDate = (date: Date, driverId: string): Promise<OrderType[]> => {
    return new Promise((resolve, reject) => {   
      OrderModel.find({
        driverId:driverId,
        deliveryDate:date
      }).then((docs)=>{
        let orders = docs.map((doc)=>{
          let order = doc as OrderType
          order.deliveryDate = doc.deliveryDate
          order.orderId = doc.id
          return order
        })
        resolve(orders)
      })
      .catch(() => reject(new Error("Error fetching orders of driver")))
    })
}




export const updatePathAcceptanceByDriver= (pathId: string, isAccepted: boolean) => {
  return new Promise((resolve, reject) => {
    PathModel.findByIdAndUpdate(pathId,{
      isAcceptedByDriver:isAccepted
    }).then((result) => resolve(result)).catch((error) => reject(new Error("Error")))
  })
}
