import { getUser, updateUser } from "db";
import { Request, Response } from "express"
import { changeOrderPriority, createOrder, deleteOrders, getDistinctOrdersDates, getOrderswithDate } from "mongoose-db";
import { changePriority, ErrorCode, order } from "types";


export const getDistinctOrdersDatesController = (req: Request, res: Response) => {
    getDistinctOrdersDates(req.body.companyId).then((data) => {
          res.status(200).json(data)
      }).catch((error) => {
          console.log(error)
          res.status(403).json({
              err: "Error"
          })
      })
  
  }


export const deleteOrdersController =(req: Request, res: Response) => {
  if (req.body.orders) {
    deleteOrders(req.body.orders).then((_) => {
      res.json({ isDeleted: true });
    }).catch((_) => {
      res.status(403).json({
        isDeleted: false
      })
    })
  }
  else {
    res.status(400).json({
      isDeleted: false
    })
  }
}

export const getOrdersController = (req: Request, res: Response) => {
  let parsedDate = req.body.date
  console.log(parsedDate)
  if (!parsedDate) {
    return res.status(403).json({
      msg: "Error in  Details "
    });
  }
  getOrderswithDate(new Date(parsedDate), req.body.companyId).then((orders) => {
    res.json(orders);
  }).catch(() => {
    res.status(403).json({
      msg: "Error fetching from firestore"
    })
  })
}

export const createOrderController = async (req: Request, res: Response) => {
    req.body.deliveryDate = new Date(req.body.deliveryDate)
    let parsedData = order.safeParse(req.body)
    if (!parsedData.success) {
      return res.status(403).json({
        err: ErrorCode.WrongInputs
      });
    }
    // handle creation limit 
   
    let company = await getUser( req.body.companyId)
    if(company.availableCount<=0){
      return res.status(403).json({
        err: ErrorCode.OrderLimitIncrease
      });
    }
  
  
    const apiKey = process.env.MAPS_API_KEY;
    let location = { lat: 0, lng: 0 }
    let placeId = ""
  
    try {
      const resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(parsedData.data.address)}&key=${apiKey}`, {
        method: "GET"
      })
      const jsonData = await resp.json()
      const results = jsonData.results;
  
      if (results.length > 0) {
        location = results[0].geometry.location;
        placeId = results[0].place_id;
      } else {
        return res.status(403).json({
          err: ErrorCode.AddressError
        });
      }
    }
    catch (e) {
      return res.status(403).json({
        err: ErrorCode.AddressError
      });
    }
  
    parsedData.data.location = location
    parsedData.data.placeId = placeId
    createOrder(parsedData.data).then(async (order) => {
      //decrease count
      await updateUser({...company,availableCount:company.availableCount-1})
      res.json({ isAdded: true })
    }).catch((error) => res.json({ isAdded: false }))
  
  }


export const changePriorityController = (req: Request, res: Response) => {
  let changePriorityParams = changePriority.safeParse(req.body)
  if (!changePriorityParams.success) {
    return res.status(403).json({
      isAdded: false,
      msg: "Error in Parameters"
    })
  }
  changeOrderPriority(changePriorityParams.data.priority, changePriorityParams.data.orderId).then((result) => {
    res.json({ isAdded: true })
  }).catch((errr) => res.json({ isAdded: false }))
}