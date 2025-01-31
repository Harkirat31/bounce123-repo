import { OrderType } from "types"
import { OrderModel } from "../models/orderModel"

export const createOrder = (orderData: OrderType) => {
  return new Promise(async (resolve, reject) => {
    OrderModel.create(orderData).then((result)=>{
      resolve("Success")
    }).catch((error)=>{
      new Error("Error "+error.toString())
    })

  //  db.collection("orders").add(orderData).then(() => resolve("Success")).catch(() => new Error("Error"))
  })
}