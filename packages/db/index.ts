import path, { resolve } from 'path';

import * as admin from 'firebase-admin';
import { homedir } from 'os'

import { DriverType, UserSignInType, RentingItemType, SideItemType, OrderType, LocationType, order, PathOrderType, UserType, ErrorCode, NotificationMessage, pathOrder, pathGeometry } from "types"
//import { API_KEY_SIGNIN } from './config';

import dotenv from "dotenv"
dotenv.config();


const firebase_secret = {
  "project_id": process.env.PROJECT_ID!,
  "private_key": process.env.PRIVATE_KEY!,
  "client_email": process.env.CLIENT_EMAIL!,
}

//const serviceaccountPath = path.join(homedir(), './', 'firebase_secret/serviceAccount.json')
try {
  admin.initializeApp({
    credential: admin.credential.cert({ clientEmail: firebase_secret.client_email, privateKey: firebase_secret.private_key, projectId: firebase_secret.project_id }),
    // credential: admin.credential.cert(serviceaccountPath),
  });
}
catch (e) {
  console.log(e)
}



const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true })



export const saveFCMToken = (uid: string, fcmToken: string) => {
  return new Promise((resolve, reject) => {
    db.collection('fcm_tokens').doc(uid).set({
      'fcmTokens': admin.firestore.FieldValue.arrayUnion(fcmToken),
    }, { merge: true }).then((res) => {
      resolve(true)
    }).catch((error) => {
      reject(false)
    })
  })

}

export const signIn = async (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.API_KEY_SIGNIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "email": email, "password": password, "returnSecureToken": true })
    }).then(response => {
      response.json().then(async (responseData) => {
        if (response.status !== 200) {
          return reject(ErrorCode.JsonParseError)
        }
        if (!responseData.localId) {
          return reject(ErrorCode.JsonParseError)
        }
        let userData  =  await admin.auth().getUser(responseData.localId)
        if (!userData.emailVerified) {
          return reject(ErrorCode.EmailNotVerified)
        }
        getUser(responseData.localId).then((user) => {
          if(!user.isApproved){
            reject(ErrorCode.UserNotApproved)
          }else{
            resolve(user)
          }
        }).catch((error) => {
           reject(ErrorCode.DbError)
        })
      }).catch((error) => {
        reject(ErrorCode.JsonParseError)
      })
    })
      .catch((error) => {
        //reject(new Error("Error in sign in through Google Api"))
        reject(ErrorCode.MapsApiError)
      })
  })
}

export const signInDriver = async (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.API_KEY_SIGNIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "email": email, "password": password, "returnSecureToken": true })
    }).then(response => {
      response.json().then((responseData) => {
        if (response.status !== 200) {
          return reject(responseData)
        }
        if (!responseData.localId) {
          return reject(new Error("Error Parsing response from google SignIn Api"))
        }
        resolve(responseData.localId)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

export const sendResetEmail = (email: string) => {
  return new Promise((resolve, reject) => {
    admin.auth().generatePasswordResetLink(email).then((result) => {
      resolve(result)
    }).catch((error) => {
      reject(error)
    })
  });
}


export const generateEmailVerifyLink = (email: string) => {
  return new Promise((resolve, reject) => {
    admin.auth().generateEmailVerificationLink(email).then((result) => {
      resolve(result)
    }).catch((error) => {
      reject(error)
    })
  });
}


export const getFuturePathDates = (uid: string,date:Date) => {
  return new Promise((resolve, reject) => {
    let futureDates: Date[] = []
      db.collection("paths").where("driverId", "==", uid).where("dateOfPath",">=",date).get().then((pathsSnapshot) => {
        console.log(pathsSnapshot.docs.length)
        pathsSnapshot.docs.forEach((path) => {
          let pathObject: PathOrderType = path.data() as PathOrderType    
          futureDates.push(pathObject.dateOfPath)
        })
        resolve(futureDates)
      }).catch((error) => {
        reject(ErrorCode.DbError)
      })
  
  })
}

export const  getAllCompaniesOfDriver = (driverId:String): Promise<DriverType[]> =>{
  return new Promise(async (resolve,reject)=>{
    let driverCompanyList: DriverType[] = [] 
    try{
      const documentSnapshot =   await db.collection("driver_company").where("uid", "==", driverId).get()
      documentSnapshot.docs.forEach((doc) => {
        let driverCompany = doc.data() as DriverType
        driverCompanyList.push(driverCompany)
      })
      resolve(driverCompanyList)
    }
    catch(error){
      reject(ErrorCode.DbError)
    }
   
  })

}

export const getDriverWithPaths = (uid: string,date:Date) => {
  return new Promise((resolve, reject) => {
    let driverCompanyList: DriverType[] = []
    let paths: PathOrderType[] = []
    let orders: OrderType[] = []
    db.collection("driver_company").where("uid", "==", uid).get().then(async (documentSnapshot) => {
      documentSnapshot.docs.forEach((doc) => {
        let driverCompany = doc.data() as DriverType
        driverCompanyList.push(driverCompany)
      })
      for (const element in driverCompanyList) {
        let company = await db.collection('users').doc(driverCompanyList[element].companyId!).get()
        driverCompanyList[element].companyName = (company.data() as UserType).companyName
        driverCompanyList[element].companyLocation = (company.data() as UserType).location
      }
      db.collection("paths").where("driverId", "==", uid).where("dateOfPath","==",date).get().then((pathsSnapshot) => {
        pathsSnapshot.docs.forEach((path) => {
          let pathObject: PathOrderType = path.data() as PathOrderType
          pathObject.pathId = path.id
          paths.push(pathObject)
        })
        getOrdersByDate(uid,date).then((ordersData) => {
          orders = ordersData

          resolve({ driverCompanyList: driverCompanyList, paths: paths, orders: orders })
        }).catch((error) => {
          reject(ErrorCode.DbError)
        })
      }).catch((error) => {
        reject(ErrorCode.DbError)
      })
    }).catch((error) => {
      reject(ErrorCode.DbError)
    })
  })
}


export const getDriver = async (uid: string, companyId: string): Promise<DriverType> => {
  return new Promise((resolve, reject) => {
    db.collection("driver_company").where("uid", "==", uid).where("companyId", "==", companyId).get().then((documentSnapshot) => {
      resolve(Object(documentSnapshot.docs[0].data()))
    }).catch((error) => {
      reject(ErrorCode.DbError)
    })
  })
}

export const signUp = async (authUser: UserSignInType): Promise<string> => {
  return new Promise((resolve, reject) => {
    admin.auth().createUser({
      email: authUser.email,
      password: authUser.password
    }).then((firebaseUser) => resolve(firebaseUser.uid)).catch(
      (error: admin.FirebaseError) => {
        if (error.code == "auth/email-already-exists") {
          reject(ErrorCode.EmailAlreadyExist)
        } else {
          reject(ErrorCode.DbError)
        }

      }
    )
  })
}

export const getAuthUserRecord = (email: string) => {
  return new Promise((resolve, reject) => {
    admin.auth().getUserByEmail(email).then((firebaseUser) => resolve(firebaseUser.uid))
      .catch((error) =>
        reject(ErrorCode.UserNotExists)
      )
  })
}


export const updateUser = (userDetail: UserType): Promise<UserType> => {
  return new Promise((resolve, reject) => {
    db.collection('users').doc(userDetail.userId!).update(
      userDetail
    ).then((result) => {
      resolve(userDetail)
    }).catch(() => reject(ErrorCode.DbError))
  })
}

export const createUser = (newUserDetail: UserType): Promise<UserType> => {
  return new Promise((resolve, reject) => {
    signUp({ email: newUserDetail.email, password: newUserDetail.password! }).then((uidNewUser) => {
      newUserDetail.userId = uidNewUser
      newUserDetail.password = ""
      newUserDetail.availableCount = parseInt(process.env.TRIAL_COUNT ?? "200")
      newUserDetail.isApproved=false

      db.collection('users').doc(uidNewUser).set(
        newUserDetail
      ).then((result) => {
        resolve(newUserDetail)
      }).catch(() => reject(ErrorCode.DbError))
    }
    ).catch((error) => {
      reject(error)
    })

  })
}


// export const createDriver = (newDriverDetail: DriverType): Promise<DriverType> => {
//   return new Promise((resolve, reject) => {
//     // first new sign up is created for driver
//     // default password is password, reset email would be sent
//     newDriverDetail.isAutomaticallyTracked = false // set tracking false during creation of driver
//     //newDriverDetail.uid = uidNewDriver
//     db.collection('drivers').add(
//       newDriverDetail
//     ).then((result) => {
//       newDriverDetail.uid = result.id
//       resolve(newDriverDetail)
//     }).catch(() => reject(ErrorCode.DbError))
//   })
// }


export const createDriver = (newDriverDetail: DriverType,password:string): Promise<DriverType> => {

  return new Promise((resolve, reject) => {
    // first new sign up is created for driver
    // default password is password, reset email would be sent
    signUp({ email: newDriverDetail.email, password:password }).then((uidNewDriver) => {
      newDriverDetail.isAutomaticallyTracked = false // set tracking false during creation of driver
      newDriverDetail.uid = uidNewDriver
      db.collection("driver_company").add(
        newDriverDetail
      ).then((res) => {
        resolve(newDriverDetail)
      }).catch((error) => {
        reject(ErrorCode.DbError)
      })
    }
    ).catch((error) => {
      if (error == ErrorCode.EmailAlreadyExist) {
        getAuthUserRecord(newDriverDetail.email).then((userId) => {
          db.collection("driver_company").where("email", "==", newDriverDetail.email).where("companyId", "==", newDriverDetail.companyId!).count().get().then((c) => {
            let exist = c.data().count
            if (exist > 0) {
              reject(ErrorCode.EmailAlreadyExist)
            } else {
              newDriverDetail.isAutomaticallyTracked = false // set tracking false during creation of driver
              newDriverDetail.uid = userId as string
              db.collection("driver_company").add(
                newDriverDetail
              ).then((res) => {
                resolve(newDriverDetail)
              }).catch((error) => {
                reject(ErrorCode.DbError)
              })
            }
          })

        }).catch((error) => {
          reject(error)
        })
      }
      else {
        reject(error)
      }
    })

  })
}


export const updatePath = (newPath: PathOrderType) => {
  return new Promise(async (resolve, reject) => {
    try {
      let oldPath = (await db.collection("paths").doc(newPath.pathId!).get()).data() as PathOrderType
      let oldPathSet = new Set(oldPath.path)
      let newPathSet = new Set(newPath.path)
      //delete nodes which are not in new path

      //set difference
      newPathSet.forEach((value) => {
        if (oldPathSet.has(value)) {
          oldPathSet.delete(value)
        }
      })
      //change status to not assigned

      for (const pathNode of oldPathSet) {
        await db.collection("orders").doc(pathNode.id).update({
          assignedPathId: "",
          currentStatus: "NotAssigned"
        })
      }
      let result = await db.collection("paths").doc(newPath.pathId!).update(newPath)
      

      for (const order of newPath.path){
        await db.collection("orders").doc(order.id).update({
          assignedPathId: newPath.pathId!,
          currentStatus: "PathAssigned"
        })
      } 
      resolve("Success")

    }
    catch {
      reject("Error")
    }

  })
}


export const updatePathGemetry = (newPath: PathOrderType) => {
  return new Promise(async (resolve, reject) => {
    try {
        await db.collection("paths").doc(newPath.pathId!).update({
          pathGeometry: newPath.pathGeometry,
        })
        resolve("Success")
      } 
    catch {
      reject("Error")
    }

  })
}



export const createPath = (newPath: PathOrderType) => {
  return new Promise(async (resolve, reject) => {
    try {
      //this should be transaction, add transaction
      let result = await db.collection("paths").add(newPath)
      for (const order of newPath.path) {
        await db.collection("orders").doc(order.id).update({
          assignedPathId: result.id,
          currentStatus: "PathAssigned",
        });
      }
      resolve("Success")

    }
    catch(error) {
      console.log(new Date().toLocaleTimeString,error)
      reject("Error")
    }

  })
}

export const assignOrderAndPath = (newPath: PathOrderType) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await db.collection("paths").add(newPath)
      newPath.path.forEach(async (order) => {
        await db.collection("orders").doc(order.id).update({
          assignedPathId: result.id,
          currentStatus: "SentToDriver",
          driverId: newPath.driverId,
          driverName: newPath.driverName
        })
      })
      resolve({ result: "Success", pathId: result.id })
    }
    catch {
      reject("Error")
    }
  })
}

export const deletePath = (path: PathOrderType) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await db.collection("paths").doc(path.pathId!).delete()
     
      for (const order of path.path){
        await db.collection("orders").doc(order.id).update({
          assignedPathId: admin.firestore.FieldValue.delete(),
          currentStatus: "NotAssigned",
          driverId: admin.firestore.FieldValue.delete(),
          driverName: admin.firestore.FieldValue.delete()
        })
      }
      resolve("Success")

    }
    catch {
      reject(ErrorCode.DbError)
    }

  })
}



export const createRentingItem = (rentingItemData: RentingItemType) => {
  return new Promise((resolve, reject) => {
    db.collection("renting_items").add(
      rentingItemData
    ).then(() => resolve("Success")).catch(() => new Error("Error"))
  })
}

export const createSideItem = (sideItemData: SideItemType) => {
  return new Promise((resolve, reject) => {
    db.collection("side_items").add(
      sideItemData
    ).then(() => resolve("Success")).catch(() => reject(new Error("Error")))
  })
}

export const createOrder = (orderData: OrderType) => {
  return new Promise((resolve, reject) => {
    db.collection("orders").add(orderData).then(() => resolve("Success")).catch(() => new Error("Error"))
  })
}

export const getOrders = (driverId: string): Promise<OrderType[]> => {
  return new Promise((resolve, reject) => {
    db.collection('orders').where("driverId", "==", driverId).get().then((result) => {
      let orders = result.docs.map((doc) => {
        let o = doc.data() as OrderType
        o.orderId = doc.id
        return o;
      })
      resolve(orders)
    }).catch((error) => reject(new Error("Error fetching orders of driver")))
  })
}

export const getOrdersByDate = (driverId: string,date:Date): Promise<OrderType[]> => {
  return new Promise((resolve, reject) => {
    db.collection('orders').where("driverId", "==", driverId).where("deliveryDate","==",date).get().then((result) => {
      let orders = result.docs.map((doc) => {
        let o = doc.data() as OrderType
        o.orderId = doc.id
        return o;
      })
      resolve(orders)
    }).catch((error) => reject(new Error("Error fetching orders of driver")))
  })
}

export const getOrdersWithPathId = (pathId: string): Promise<OrderType[]> => {
  return new Promise((resolve, reject) => {
    db.collection('orders').where("assignedPathId", "==", pathId).get().then((result) => {
      let orders = result.docs.map((doc) => doc.data() as OrderType)
      resolve(orders)
    }).catch((error) => reject(new Error("Error fetching orders of driver")))
  })
}

export const getOrderswithDate = (date: Date, companyId: string): Promise<OrderType[]> => {
//  let cachedData =  getCachedObject(date.toISOString()+companyId)
//  if (cachedData){
//   console.log("Returning Cached")
//   return  Promise.resolve(cachedData)
//  }
//  console.log("Not Cached")
  return new Promise((resolve, reject) => {
    db.collection('orders').where("companyId", "==", companyId).where("deliveryDate", "==", date).get().then((result) => {
      let orders = result.docs.map(
        (doc) => {
          let order = doc.data() as OrderType
          order.deliveryDate = doc.data().deliveryDate.toDate(),
            order.orderId = doc.id
          return order
        }
      )
      //only add in cache when size of orders grreater than 0 to avoid unnecessary space
      // if(orders && orders.length>0){
      //   addObjectInCache(date.toISOString()+companyId,orders)
      // }
      resolve(orders)
    }).catch((error) => reject(new Error("Error fetching orders of driver")))
  })
}

export const getPathswithDate = (date: Date, companyId: string): Promise<PathOrderType[]> => {

  return new Promise((resolve, reject) => {
    db.collection('paths').where("companyId", "==", companyId).where("dateOfPath", "==", date).get().then((result) => {
      let paths = result.docs.map(
        (doc) => {
          let path = doc.data() as PathOrderType
          path.dateOfPath = doc.data().dateOfPath.toDate()
          path.pathId = doc.id
          return path
        }
      )
      resolve(paths)
    }).catch((error) => reject(new Error("Error fetching paths")))
  })
}

export const updateCurrentLocation = (driverId: string, location: LocationType) => {
  return new Promise((resolve, reject) => {
    db.collection('drivers').doc(driverId).update({
      currentLocation: location
    }).then((result) => resolve(result)).catch((error) => reject(new Error("Error")))
  })
}

export const updateOrderStatus = (orderId: string, currentStatus: string) => {
  return new Promise((resolve, reject) => {
    db.collection('orders').doc(orderId).update({
      currentStatus: currentStatus
    }).then((result) => resolve(result)).catch((error) => reject(new Error("Error")))
  })
}

export const updatePathAcceptanceByDriver= (pathId: string, isAccepted: boolean) => {
  return new Promise((resolve, reject) => {
    db.collection('paths').doc(pathId).update({
      isAcceptedByDriver: isAccepted
    }).then((result) => resolve(result)).catch((error) => reject(new Error("Error")))
  })
}



export const assignOrderToDriver = (driverId: string, driverName: string, orderId: string) => {
  return new Promise((resolve, reject) => {
    db.collection('orders').doc(orderId).update({
      driverId: driverId,
      driverName: driverName,
      currentStatus: "Assigned"
    }).then((result) => resolve(result)).catch((error) => reject(new Error("Error")))
  })
}

export const changeOrderPriority = (priority: string, orderId: string) => {
  return new Promise((resolve, reject) => {
    db.collection('orders').doc(orderId).update({
      priority: priority,
    }).then((result) => resolve(result)).catch((error) => reject(new Error("Error")))
  })
}


export const getRentingItems = () => {
  return new Promise((resolve, reject) => {
    db.collection("renting_items").get().then(
      (result) => {
        let rentingItems = result.docs.map((doc) => {
          let rentingItem = doc.data() as RentingItemType
          rentingItem.rentingItemId = doc.id
          return rentingItem
        })
        if (rentingItems.length > 0) {
          resolve(rentingItems)
        }
        else {
          resolve([])
        }
      }
    ).catch((error) => reject(new Error("Error Fetching Data")))
  })
}

export const getSideItems = () => {
  return new Promise((resolve, reject) => {
    db.collection("side_items").get().then(
      (result) => {
        let sideItems = result.docs.map((doc) => {
          let sideItem = doc.data() as SideItemType
          sideItem.sideItemId = doc.id
          return sideItem
        })
        if (sideItems.length > 0) {
          resolve(sideItems)
        }
        else {
          resolve([])
        }
      }
    ).catch((error) => reject(new Error("Error Fetching Data")))
  })
}

export const getDrivers = async (companyId: string) => {
  return new Promise((resolve, reject) => {
    db.collection("driver_company").where("companyId", "==", companyId).get().then(
      (result) => {
        let drivers = result.docs.map((doc) => {
          let driver = doc.data() as DriverType
          return driver
        })
        if (drivers.length > 0) {
          resolve(drivers)
        }
        else {
          resolve([])
        }
      }
    ).catch((error) => reject(new Error("Error Fetching Data")))
  })
}

export const getUser = (userId: string) => {
  return new Promise<UserType>((resolve, reject) => {
    db.collection("users").doc(userId).get().then((result) => {
      let user = result.data() as UserType
      user.userId = userId
      resolve(user)
    }
    ).catch((error) => reject(new Error(error.toString())))
  })
}

export const assignPathToDriver = (path: PathOrderType) => {
  return new Promise((resolve, reject) => {
    db.collection('paths').doc(path.pathId!).update({
      driverId: path.driverId,
      driverName: path.driverName,
    }).then((result) => {
      path.path.forEach(async (pathNode) => {
        await db.collection('orders').doc(pathNode.id).update({
          driverId: path.driverId,
          driverName: path.driverName,
          currentStatus: "SentToDriver"
        })
      })
      resolve(result)
    }).catch((error) => reject(new Error("Error")))
  })
}
export const cancelPath = (path: PathOrderType) => {
  return new Promise(async (resolve, reject) => {
    try {
      const nonDeliveredOrdersDocs = (await db.collection('orders').where("assignedPathId", "==", path.pathId).where("currentStatus", "!=", "Delivered").get()).docs
      const nonDeliveredOrders: OrderType[] = []
      const nonDeliveredOrderIds = new Set<string>()
      nonDeliveredOrdersDocs.forEach((doc) => {
        nonDeliveredOrders.push(doc.data() as OrderType)
        nonDeliveredOrderIds.add(doc.id)
      })
      const modifiedPath = path.path.filter((p) => {
        if (nonDeliveredOrderIds.has(p.id)) {
          return false
        }
        else {
          return true
        }
      })

      for (const order of nonDeliveredOrderIds) {
        await db.collection("orders").doc(order).update({
          "driverId": admin.firestore.FieldValue.delete(),
          "driverName": admin.firestore.FieldValue.delete(),
          "assignedPathId": admin.firestore.FieldValue.delete(),
          "currentStatus": "NotAssigned"
        })
      }
      //if modified path length is ZERO, delete path
      if (modifiedPath.length == 0) {
        await db.collection("paths").doc(path.pathId!).delete()
        resolve({ result: true, isPathDeleted: true })
      }
      else {
        await db.collection("paths").doc(path.pathId!).update({
          path: modifiedPath
        })
        resolve({ result: true, isPathDeleted: false, modifiedPath: modifiedPath })
      }
    }
    catch (error) {
      console.log(error)
      reject({ result: false, isPathDeleted: false })
    }

  })
}

export const getFCMTokens = (uid: string) => {
  return new Promise<string[]>((resolve, reject) => {
    db.collection('fcm_tokens').doc(uid).get().then((result) => {
      let data = result.data() as { fcmTokens: string[] }
      if(data && data.fcmTokens){
        resolve(data.fcmTokens)
      }
      else{
        console.log("eeee")
        resolve([])
      }
    }).catch((error) => {
      reject(error)
    })
  })
}

export const sendNotification = async (driverId: string, notificationMessage: NotificationMessage) => {
  let fcmTokens = await getFCMTokens(driverId);
  fcmTokens.forEach((token) => {  
    const message = {
      token: token,
      notification: {
        title: notificationMessage.companyName,
        body: notificationMessage.message,
      },
    };
    admin.messaging().send(message)
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  })

}

export const deleteOrders = (orders: string[]) => {
  return new Promise((resolve, reject) => {
    orders.forEach(async (order, index) => {
      try {
        await db.collection('orders').doc(order).delete()
        if (index === orders.length - 1) {
          resolve("deleted")
        }
      }
      catch (_) {
        if (index === orders.length - 1) {
          resolve("deleted")
        }
      }
    })
  })
}


export const deleteDriver = (driverId: string, companyId: string) => {
  return new Promise((resolve, reject) => {
    db.collection("driver_company").where("uid", "==", driverId).where("companyId", "==", companyId).get().then((document) => {
      let driverDoc = document.docs[0].id
      db.collection("driver_company").doc(driverDoc).delete().then((res) => {
        resolve("Deleted")
      }).catch((e) => {
        reject(ErrorCode.DbError)
      })
    }).catch((e) => {
      console.log(e)
      reject(ErrorCode.DbError)
    })
  })
}


export const saveVote = async (name: string, gender: string) => {
  return new Promise((resolve, reject) => {
    db.collection("gender").add({name,gender}).then(() => resolve("Success")).catch(() => new Error("Error"))
  })
}


export const getGenderData = async () => {
  return new Promise((resolve, reject) => {
    db.collection("gender").get().then(
      (result) => {
        let data = result.docs.map((doc) => {
          let driver = doc.data()
          return driver
        })
        if (data.length > 0) {
          resolve(data)
        }
        else {
          resolve([])
        }
      }
    ).catch((error) => reject(new Error("Error Fetching Data")))
  })
}








const test = async () => {

  // await createTestOrder()
  // console.log("done")


  //const c = new Date().getMilliseconds()

  //getRentingItems().then((result) => console.log(result))
  //assignOrderToDriver("7GnMyRNWRzMU2cShccm4JkrRuEu1","VuXKAvFciTXe4Wo4axrR")
  //updateCurrentLocation("7GnMyRNWRzMU2cShccm4JkrRuEu1",{lat:"1",long:"2"})

  // createUser({
  //   uid:"7GnMyRNWRzMU2cShccm4JkrRuEu1",
  //   currentLocation:{lat:"3.44",long:"5.99"},
  //   isAutomaticallyTracked:true,
  //   name:"Dexter",
  //   phone:"4165678099",
  //   role:"driver",
  //   vehicleCapacity:20,
  //   vehicleStyle:"Pick Up",
  //   email:"harry@gmail.com"
  // }).then((r)=>console.log(r))

  // await getOrders("driverId").then((result)=>console.log(result))
  //await createUser({email:"harry@gmail.com",password:"password"},{email:"harry@gmail.com"}).then((r)=>console.log(r)).catch((s)=>console.log("error"))
  //await signIn("harry@gmail.com","password").then((x)=>console.log(x)).catch((e)=>console.log(e))
  // createRentingItem(  {
  //     title:"Animal Tiger",
  //     deliveryPrice:100,
  //     capacity:20,
  //     category:"Bouncey Castle"
  //   } ).then((result)=>console.log(result))

  //createSideItem(  {   title:"Blower",capacity:1, } ).then((result)=>console.log(result))

  // createOrder({
  //   rentingItemId:"aKzczHh3fPQFS3tXlzJM",
  //   location:{lat:"3.4545",long:"7.766"},
  //   sideItems:[{sideItemId:"GKWF3lfHwv47JW87x41U",count:2}],
  //   address:"19 simmons blvd",
  //   currentStatus:"Pending to deliver",
  //   deliveryDate:Date.now().toString(),
  //   driverId:"driverId",
  // }).then((result)=>console.log(result)).catch((error)=>console.log(error))
}
//0ph5kBt6cMCxiJ3SUMUu
//test()
//getUser("6JwbGWEL1DUWSv11GlLAdMm9EQn2").then((result)=>console.log(result))

//createUser({email:"harry1@gmail.com",password:"password"},{email:"harry1@gmail.com"}).then((r)=>console.log(r)).catch((s)=>console.log("error"))


//getUser("uid").then((x)=>console.log(x))

//signIn("harkiratsingh.tu@gmail.com","password123").then((x)=>console.log(x)).catch((e)=>console.log(e))