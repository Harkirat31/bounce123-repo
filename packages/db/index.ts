import path from 'path';

import * as admin from 'firebase-admin';
import { homedir } from 'os'

import { DriverType, UserSignInType, RentingItemType, SideItemType, OrderType, LocationType, order, PathOrderType } from "types"
// Initialize Firebase Admin SDK

const serviceaccountPath = path.join(homedir(), './', 'firebase_secret/serviceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceaccountPath),
});

const db = admin.firestore();


async function getData() {
  const x = await db.collection('test').doc("1").get()
  console.log(x);
}

export const signIn = async (email: string, password: string): Promise<DriverType> => {
  return new Promise(async (resolve, reject) => {
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAqhTnwk7mkiABKb1onJDVJI8wNmhJbe80', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "email": email, "password": password, "returnSecureToken": true })
    }).then(response => {
      response.json().then(async (responseData) => {
        if (response.status !== 200) {
          return reject(responseData)
        }
        if (!responseData.localId) {
          return reject(new Error("Error Parsing response from google SignIn Api"))
        }
        await getDriver(responseData.localId).then((driver) => {
          resolve(driver)
        }).catch((error) => {
          return reject(new Error("Error Fetching User from getUser Method"))
        })
      }).catch((error) => {
        reject(new Error("Json Parsing Error" + error))
      })
    })
      .catch((error) => {
        reject(new Error("Error in sign in through Google Api"))
      })
  })
}


export const getDriver = async (uid: string): Promise<DriverType> => {
  return new Promise((resolve, reject) => {
    db.collection("drivers").doc(uid).get().then((documentSnapshot) => {
      resolve(Object(documentSnapshot.data()))
    })
  })
}

export const signUp = async (authUser: UserSignInType): Promise<string> => {
  return new Promise((resolve, reject) => {
    admin.auth().createUser({
      email: authUser.email,
      password: authUser.password
    }).then((firebaseUser) => resolve(firebaseUser.uid)).catch((error: admin.FirebaseError) => reject(error))
  })
}

export const createDriver = (newDriverDetail: DriverType): Promise<DriverType> => {
  return new Promise((resolve, reject) => {
    // first new sign up is created for driver
    // default password is password, reset email would be sent
    signUp({ email: newDriverDetail.email, password: "password" }).then((uidNewDriver) => {
      newDriverDetail.isAutomaticallyTracked = false // set tracking false during creation of driver
      newDriverDetail.uid = uidNewDriver
      db.collection('drivers').doc(uidNewDriver).set(
        newDriverDetail
      ).then((result) => {
        resolve(newDriverDetail)
      }).catch(() => reject(new Error("Error creating driver in firestore db")))
    }
    ).catch((error: admin.FirebaseError) => {
      reject(error)
    })

  })
}

export const createPath = (newPath: PathOrderType) => {
  return new Promise((resolve, reject) => {
    db.collection("paths").add(newPath).then(() => resolve("Success")).catch(() => reject("Error"))
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
      let orders = result.docs.map((doc) => doc.data() as OrderType)
      resolve(orders)
    }).catch((error) => reject(new Error("Error fetching orders of driver")))
  })
}

export const getOrderswithDate = (date: Date): Promise<OrderType[]> => {

  return new Promise((resolve, reject) => {
    db.collection('orders').where("deliveryDate", "==", date).get().then((result) => {
      let orders = result.docs.map(
        (doc) => {
          let order = doc.data() as OrderType
          order.deliveryDate = doc.data().deliveryDate.toDate(),
            order.orderId = doc.id
          return order
        }
      )
      resolve(orders)
    }).catch((error) => reject(new Error("Error fetching orders of driver")))
  })
}

export const getPathswithDate = (date: Date): Promise<PathOrderType[]> => {

  return new Promise((resolve, reject) => {
    db.collection('paths').where("dateOfPath", "==", date).get().then((result) => {
      let paths = result.docs.map(
        (doc) => {
          let path = doc.data() as PathOrderType
          path.dateOfPath = doc.data().dateOfPath.toDate(),
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


export const assignOrderToDriver = (driverId: string, driverName: string, orderId: string) => {
  return new Promise((resolve, reject) => {
    db.collection('orders').doc(orderId).update({
      driverId: driverId,
      driverName: driverName,
      currentStatus: "Assigned"
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

export const getDrivers = () => {
  return new Promise((resolve, reject) => {
    db.collection("drivers").get().then(
      (result) => {
        let drivers = result.docs.map((doc) => {
          let driver = doc.data() as DriverType
          driver.uid = doc.id
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






const test = async () => {
  const c = new Date().getMilliseconds()

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

//test()
//getUser("6JwbGWEL1DUWSv11GlLAdMm9EQn2").then((result)=>console.log(result))

//createUser({email:"harry1@gmail.com",password:"password"},{email:"harry1@gmail.com"}).then((r)=>console.log(r)).catch((s)=>console.log("error"))


//getUser("uid").then((x)=>console.log(x))

//signIn("harkiratsingh.tu@gmail.com","password123").then((x)=>console.log(x)).catch((e)=>console.log(e))