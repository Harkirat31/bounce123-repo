import express, { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import { ErrorCode, user, userSignIn } from "types";
import { createUser, signIn, signInDriver, signUp } from "db"

const router = express.Router();


router.post("/signin", (req: Request, res: Response) => {
  let parsedSignInInput = userSignIn.safeParse(req.body)
  if (!parsedSignInInput.success) {
    return res.status(403).json({
      err: ErrorCode.WrongInputs
    });
  }
  const email = parsedSignInInput.data.email;
  const password = parsedSignInInput.data.password;
  signIn(email, password).then((user) => {
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ user: user }, secretKey!, { expiresIn: '30 days', });
    res.json({ message: 'Login successfully', token });
  }).catch((error) => {
    res.status(401).json({
      err: ErrorCode.WorngCredentials
    });
  })

})


router.post("/signinDriver", (req: Request, res: Response) => {
  let parsedSignInInput = userSignIn.safeParse(req.body)
  if (!parsedSignInInput.success) {
    return res.status(403).json({
      err: ErrorCode.WrongInputs
    });
  }
  const email = parsedSignInInput.data.email;
  const password = parsedSignInInput.data.password;
  signInDriver(email, password).then((uid: any) => {
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ uid }, secretKey!, { expiresIn: '30 days', });
    res.json({ message: 'Login successfully', token });
  }).catch((error) => {
    res.status(401).json({
      err: ErrorCode.WorngCredentials
    });
  })

})
router.post("/signup", (req: Request, res: Response) => {
  let parsedSignInInput = userSignIn.safeParse(req.body)
  if (!parsedSignInInput.success) {
    return res.status(403).json({
      msg: "Error in User Details"
    });
  }
  const email = parsedSignInInput.data.email;
  const password = parsedSignInInput.data.password;
  signUp({ email, password }).then((uid) => {

    res.json({ message: 'Sign Up Successfully', uid });
  })

})
router.post("/createUser", (req: Request, res: Response) => {
  let parsedUserData = user.safeParse(req.body)
  if (!parsedUserData.success) {
    return res.status(403).json({
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
      parsedUserData.data.location = location
      parsedUserData.data.placeId = placeId
      createUser(parsedUserData.data).then((result) => {
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign({ user: result }, secretKey!, { expiresIn: '30 days', });
        res.json({ message: 'Login successfully', token });
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
      err: ErrorCode.FirebaseError
    });
  })

})



export default router