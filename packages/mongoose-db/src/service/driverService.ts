import { OrderType, PathOrderType } from "types"
import { PathModel } from "../models/pathModel"
import { OrderModel } from "../models/orderModel"

export const getPathsOfDriverByDate =( driverId: string,date: Date):Promise<PathOrderType[]>=>{
     return new Promise((resolve, reject) => {   
          PathModel.find({
            driverId:driverId,
            dateOfPath:date
          }).then((docs)=>{
            let paths = docs.map((doc)=> doc as PathOrderType)
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