import { ErrorCode, OrderType } from "types"
import { OrderModel } from "../models/orderModel"

export const createOrder = (orderData: OrderType) => {
  return new Promise(async (resolve, reject) => {
    OrderModel.create(orderData).then((result)=>{
      resolve("Success")
    }).catch((error)=>{
      new Error("Error "+error.toString())
    })
  })
}


export const getOrderswithDate = (date: Date, companyId: string): Promise<OrderType[]> => {
    return new Promise((resolve, reject) => {   
      OrderModel.find({
        companyId:companyId,
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

export const getOrdersWithPathId = (pathId: string): Promise<OrderType[]> => {
  return new Promise((resolve, reject) => {
    OrderModel.find({ assignedPathId: pathId }).then((docs) => {
      let orders = docs.map((doc) => doc as OrderType)
      resolve(orders)
    }).catch((error) => reject(new Error("Error fetching orders of driver")))
  })
}


export const changeOrderPriority = (priority: string, orderId: string) => {
  return new Promise((resolve, reject) => {
    OrderModel.findByIdAndUpdate(orderId,{
      priority:priority
    }).then((result) => resolve(result)).catch((error) => reject(new Error("Error")))
  })
}

export const deleteOrders = (orders: string[]) => {
  return new Promise((resolve, reject) => {
    OrderModel.deleteMany({
      _id:{$in:orders}
    }).then(()=>{
      resolve("deleted")
    }).catch((error)=>{
      reject("failed")
    })
  })
}


export const updateOrderStatus = (orderId: string, currentStatus: string) => {
  return new Promise((resolve, reject) => {
    OrderModel.findByIdAndUpdate(orderId,{
      currentStatus: currentStatus
    }).then((result) => resolve(result)).catch((error) => reject(new Error("Error")))
  }) 
}

export const getDistinctOrdersDates = (uid: string) => {
  return new Promise((resolve, reject) => {
    OrderModel.distinct('deliveryDate', {
      companyId: uid,
    }).then((futureDates => {
      resolve(futureDates)
    })).catch((error) => {
      reject(ErrorCode.DbError)
    })

  })
}
