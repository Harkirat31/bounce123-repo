import { Document, model, Schema } from "mongoose";
import { PathOrderType } from "types";

interface IPath extends PathOrderType, Document { 
}

const pathSchema = new Schema<IPath>({
      pathId: { type: String, required: false },
      companyId: { type: String, required: false },
      startingLocation:{
        type:{
            lat:Number,
            lng:Number
        },
        required:false
      },
      show:{type:Boolean,required:true,default:true},
      path:{
        type:[{
            id:String,
            latlng: {
                type:{
                    lat:Number,
                    lng:Number
                },
                required:false,
            }
        }],
        required:true
      },
      dateOfPath:{
        type:Date,
        required:true
      },
      driverId:{ type: String, required: false },
      driverName:{ type: String, required: false },
      isAcceptedByDriver:{ type: Boolean, required: false },
      pathGeometry:{
        type:{
            geometry:{
                type:String,required:false
            },
            distanceInKm:{
                type:Number,required:false
            },
            durationInMins:{
                type:Number,required:false
            },
        },
        required:false
      }
    

})


export const PathModel = model<IPath>('Path', pathSchema);

