import { Document, model, Schema } from "mongoose";
import { OrderType } from "types";

interface IOrder extends OrderType, Document { 
}

enum OrderStatus {
    NotAssigned = "NotAssigned",
    Assigned = "Assigned",
    PathAssigned = "PathAssigned",
    SentToDriver = "SentToDriver",
    Accepted = "Accepted",
    OnTheWay = "OnTheWay",
    Delivered = "Delivered",
    Picked = "Picked",
    Returned = "Returned",
}
enum OrderPriority{
   High= "High", 
   Medium="Medium",
   Low = "Low",
   Special = "Special"
}


const orderSchema = new Schema<IOrder>({
    companyId: { type: String, required: false },
    assignedPathId: { type: String, required: false },
    orderId: { type: String, required: false },
    orderNumber: { type: String, required: false },
    itemsDetail: { type: String, required: false },
    cemail: { type: String, required: false },
    address: { type: String, required: true, minlength: 1 },
    cname: { type: String, required: true, minlength: 1 },
    cphone: { type: String, required: true, minlength: 10 },
    location: {
        type:{
            lat:Number,
            lng:Number
        },
        required:false
    },
    placeId: { type: String, required: false },
    driverId: { type: String, required: false },
    driverName: { type: String, required: false },
    currentStatus: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.NotAssigned,
    },
    deliveryDate: {type:Date,required:true},
    specialInstructions: { type: String, required: false },
    paymentStatus: { type: String, required: false },
    deliverTimeRangeStart: {type:String,required:false,minlength:1,maxlength:24},
    deliverTimeRangeEnd:{type:String,required:false,minlength:1,maxlength:24},
    priority: {
        type: String,
        required: true,
        enum: Object.values(OrderPriority),
        default: OrderPriority.Medium,
    },
})


export const OrderModel = model<IOrder>('Order', orderSchema);

