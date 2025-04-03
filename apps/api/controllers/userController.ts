import { getUser, updateUser } from "db"
import { Request, Response } from "express"
import { ErrorCode, user } from "types"

export const getUserController =  (req: Request, res: Response) => {
  getUser(req.body.companyId).then((result) => res.json(result)).catch((e) => {
    res.status(400).json({ msg: "Error" })
  })
}


export const updateUserController = (req: Request, res: Response) => {
    let parsedUserData = user.safeParse(req.body)
    if (!parsedUserData.success) {
      return res.status(400).json({
        err: ErrorCode.WrongInputs
      });
    }
    const apiKey = process.env.MAPS_API_KEY;
    let location = { lat: 0, lng: 0 }
    let placeId = ""
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(parsedUserData.data.address)}&key=${apiKey}`, {
      method: "GET"
    }).then((respMapsApi) => respMapsApi.json().then((mapsData) => {
      const results = mapsData.results;
      if (results.length > 0) {
        console.log("location")
        location = results[0].geometry.location;
        placeId = results[0].place_id;
      } else {
        //return locatin not right Error
        return res.status(403).json({
          err: ErrorCode.AddressError
        });
      }
      if (parsedUserData.success) {
        parsedUserData.data.userId = req.body.companyId
        parsedUserData.data.location = location
        parsedUserData.data.placeId = placeId
        updateUser(parsedUserData.data).then((result) => {
          res.json({ isUpdated: true });
        }).catch((error) => {
          return res.status(403).json({
            err: error
          });
        })
      }
  
    }).catch((jsonParseError) => {
      return res.status(403).json({
        err: ErrorCode.JsonParseError
      });
    })).catch((mapsAPIError) => {
      return res.status(403).json({
        err: ErrorCode.DbError
      });
    })
  
  }