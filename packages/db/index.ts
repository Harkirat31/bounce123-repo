//import path from 'path';

import * as admin from 'firebase-admin';
import { UserType, UserSignInType, RentingItemType, SideItemType, OrderType, LocationType } from "types"
// Initialize Firebase Admin SDK

//const serviceaccountPath = path.join(__dirname,'./','serviceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert("/Users/harry/dev/projects/bounce123/packages/db/serviceAccount.json"),
});

const db = admin.firestore();

async function getData() {
  const x = await db.collection('test').doc("1").get()
  console.log(x);
}

export const signIn = async (email: string, password: string): Promise<UserType> => {
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
        await getUser(responseData.localId).then((user) => {
          resolve(user)
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


export const getUser = async (uid: string): Promise<UserType> => {
  return new Promise((resolve, reject) => {
    db.collection("users").doc(uid).get().then((documentSnapshot) => {
      resolve(Object(documentSnapshot.data()))
    })
  })
}

export const signUp = async (authUser: UserSignInType): Promise<string> => {
  return new Promise((resolve, reject) => {
    admin.auth().createUser({
      email: authUser.email,
      password: authUser.password
    }).then((firebaseUser) => resolve(firebaseUser.uid)).catch((error) => reject(new Error("Error creating Firebase Auth User")))
  })
}

export const createUser = async (newUserDetail: UserType): Promise<UserType> => {
  return new Promise((resolve, reject) => {
    db.collection('users').doc(newUserDetail.uid!).set(
      newUserDetail
    ).then((result) => {
      resolve(newUserDetail)
    }).catch(() => reject(new Error("Error creating user in firebase db")))
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

export const updateCurrentLocation = (driverId: string, location: LocationType) => {
  return new Promise((resolve, reject) => {
    db.collection('users').doc(driverId).update({
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


export const assignOrderToDriver = (driverId: string, orderId: string) => {
  return new Promise((resolve, reject) => {
    db.collection('orders').doc(orderId).update({
      driverId: driverId
    })
  })
}

export const getRentingItems = () => {
  return new Promise((resolve, reject) => {
    db.collection("renting_items").get().then(
      (result) => {
        let rentingItems = result.docs.map((doc) => doc.data() as RentingItemType)
        if (rentingItems.length > 0) {
          resolve(rentingItems)
        }
        else {
          reject(new Error("No Renting Item"))
        }
      }
    ).catch((error) => reject(new Error("Error Fetching Data")))
  })
}





const test = async () => {

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