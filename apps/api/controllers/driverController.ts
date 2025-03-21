import { getAllCompaniesOfDriver, getUser } from "db"
import {getOrdersOfDriverByDate, getPathsOfDriverByDate, removeNextOrderOfPath, updateNextOrderOfPath, updateOrderStatus, updatePathAcceptanceByDriver} from "mongoose-db"
import { Request, Response } from "express"
import { ErrorCode, OrderType, PathOrderType, updateNextOrderOfPath_Zod, updatePathAcceptance, updateStatusOfOrder } from "types"
import { deliveredSocketHandler, pathAcceptedOrRejectedSocketHandler, updateNextOrderOfPathSocketHandler } from "../sockets/handlers/orderHandler"

export const getDriverWithPaths = async (req: Request, res: Response) => {
    try {
        const driverId = req.body.uid
        const date = new Date(req.body.date)
        let driverCompanyList = await getAllCompaniesOfDriver(driverId)
        for (const element in driverCompanyList) {
            let company = await getUser(driverCompanyList[element].companyId!)
            driverCompanyList[element].companyName = company.companyName
            driverCompanyList[element].companyLocation = company.location
        }
        let paths = await getPathsOfDriverByDate(driverId,date)
        let orders: OrderType[] = await getOrdersOfDriverByDate(date,driverId)
        res.json({ driverCompanyList: driverCompanyList, paths: paths, orders: orders })
    }
    catch {
        res.status(400).json({
            err: ErrorCode.DbError
        })
    }

}


export const updateOrderStatusController = async (req: Request, res: Response) => {
        let parsedData = updateStatusOfOrder.safeParse(req.body)
        if (!parsedData.success) {
            return res.status(403).json({
                isUpdated: false,
                msg: "Error in Parameters"
            });
        }
        try{
            // below two updades should be transaction
            // first update order Status
            await  updateOrderStatus(parsedData.data.orderId, parsedData.data.currentStatus)
            
            // update Path. Remove nextOrderToBeDelivered
            await removeNextOrderOfPath(parsedData.data.pathId,parsedData.data.orderId)

             // send real time upodate to client via Web Socket
             if(parsedData.data.currentStatus=="Delivered" && parsedData.data.companyId ){
                deliveredSocketHandler(parsedData.data.companyId,parsedData.data.orderId)
            }
            res.json({
                isUpdated: true
            })
        }
        catch(error:any){
            res.json({
                isUpdated: false
            })
        }
}


export const updateNextOrderOfPathController = async (req: Request, res: Response) => {
    let parsedData = updateNextOrderOfPath_Zod.safeParse(req.body)
    if (!parsedData.success) {
        return res.status(403).json({
            isUpdated: false,
            msg: "Error in Parameters"
        });
    }
    try{
        await updateNextOrderOfPath(parsedData.data.pathId,parsedData.data.orderId)

        if(parsedData.data.companyId){
            updateNextOrderOfPathSocketHandler(parsedData.data.companyId,parsedData.data.pathId,parsedData.data.orderId)
        } 

        res.json({
            isUpdated: true
        })

    }
    catch(error){
        res.json({
            isUpdated: false
        })
    }
}

export const updatePathAcceptanceByDriverController  =async(req:Request,res:Response)=>{
 let parsedData = updatePathAcceptance.safeParse(req.body)
    if (!parsedData.success) {
        return res.status(403).json({
            isUpdated: false,
            msg: "Error in Parameters"
        });
    }
    updatePathAcceptanceByDriver(parsedData.data.pathId, parsedData.data.isAcceptedByDriver).then((result) => {  
        //send email,socketUpdate or whatever in future to admin
        if(parsedData.data.companyId){
            pathAcceptedOrRejectedSocketHandler(parsedData.data.companyId,parsedData.data.pathId,parsedData.data.isAcceptedByDriver)
        } 
       

        return res.json({
            isUpdated: true
        })
    }).catch((error) => {
        return res.json({
            isUpdated: false
        })
    })

}

