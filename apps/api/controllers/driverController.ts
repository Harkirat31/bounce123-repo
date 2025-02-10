import { getAllCompaniesOfDriver, getUser } from "db"
import {getOrdersOfDriverByDate, getPathsOfDriverByDate, removeNextOrderOfPath, updateNextOrderOfPath, updateOrderStatus} from "mongoose-db"
import { Request, Response } from "express"
import { ErrorCode, OrderType, PathOrderType, updateNextOrderOfPath_Zod, updateStatusOfOrder } from "types"

export const getDriverWithPaths = async (req: Request, res: Response) => {
    try {
        const driverId = req.body.uid
        const date = new Date(req.body.date)
        let driverCompanyList = await getAllCompaniesOfDriver(driverId)
        if (driverCompanyList == ErrorCode.DbError) {
            return res.status(400).json({
                err: ErrorCode.DbError
            })
        }
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

            res.json({
                isUpdated: true
            })

        }
        catch(error:any){
            console.log("error is", error)
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


