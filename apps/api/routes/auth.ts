import express, { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { ErrorCode, user, userSignIn } from "types";
import { createUser, generateEmailVerifyLink, getAuthUserRecord, sendResetEmail, signIn, signInDriver, signUp } from "db"
import sgMail from "@sendgrid/mail"
import dotenv from "dotenv"
dotenv.config();



const SEND_GRID_API = process.env.SEND_GRID_API


sgMail.setApiKey(SEND_GRID_API!)


const router = express.Router();


router.post("/verifyEmail", (req: Request, res: Response) => {
  const email = req.body.email
  if (email) {
    generateEmailVerifyLink(email).then((result) => {
      const msg = {
        to: email, // Change to your recipient
        from: 'info@easeyourtasks.com', // Change to your verified sender
        subject: 'Email Verification',
        html: `<p>Hi </br>   </p> <a href="${result}"> Click this link to verify the Email</a>`,
      }
      sgMail.send(msg).then((result2) => {
        res.json({ sent: true })
      }).catch((error) => {
        console.log(error)
        res.status(401).json({
          sent: false
        });
      })
    }).catch((error) => {
      res.status(401).json({
        sent: false
      });
    })
  } else {
    res.status(401).json({
      sent: false
    });
  }
})


router.post("/resetPassword", (req: Request, res: Response) => {
  const email = req.body.email;
  if (email) {
    sendResetEmail(email).then((result: any) => {
      const msg = {
        to: email, // Change to your recipient
        from: 'info@easeyourtasks.com', // Change to your verified sender
        subject: 'Reset Password',
        html: `<p>Hi </br>   </p> <a href="${result}"> Click this link to generate new Password</a>`,
      }
      sgMail.send(msg).then((result2) => {
        res.json({ reset: true })
      }).catch((error) => {
        console.log(error)
        res.status(401).json({
          reset: false
        });
      })
    }).catch((error) => {
      res.status(401).json({
        reset: false
      });
    })
  } else {
    res.status(401).json({
      reset: false
    });
  }
})


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
    res.status(201).json({ message: 'Login successfully', token });
  }).catch((error) => {
    console.log("Error is ",error)
    if (error == ErrorCode.EmailNotVerified) {
      res.status(401).json({
        err: ErrorCode.EmailNotVerified
      })
    } else {
      res.status(401).json({
        err: ErrorCode.WorngCredentials
      })
    }
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
  }).catch((error: any) => {
    console.log(error)
    try {
      if (error.error.code == 400) {
        res.status(401).json({
          err: ErrorCode.WorngCredentials
        });
      }
      else {
        res.status(401).json({
          err: ErrorCode.FirebaseError
        });
      }
    }
    catch (e) {
      res.status(401).json({
        err: ErrorCode.FirebaseError
      });
    }


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
        res.json({ message: 'Login successfully', success: true });
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