import { getAllCompaniesOfDriver, getUser } from "db"
import {getOrdersOfDriverByDate, getPathsOfDriverByDate} from "mongoose-db"
import { Request, Response } from "express"
import { ErrorCode, OrderType, PathOrderType } from "types"

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

