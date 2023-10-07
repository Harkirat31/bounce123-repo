import * as admin from 'firebase-admin';
import {UserType,UserSignInType} from "types"
// Initialize Firebase Admin SDK

admin.initializeApp({
  credential: admin.credential.cert("serviceAccount.json"),
});

const db = admin.firestore();

async function getData(){
    const x =  await db.collection('test').doc("1").get()
    console.log(x);
}

export const signIn=async (email:string,password:string):Promise<UserType>=>{
    return new Promise(async (resolve,reject)=>{
       fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAqhTnwk7mkiABKb1onJDVJI8wNmhJbe80', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "email":email, "password":password,"returnSecureToken":true})
        }).then(response=>{
          response.json().then(async (responseData)=>{
            if(response.status!==200){
              return reject(responseData)
            }
            if(!responseData.localId){
              return reject(new Error("Error Parsing response from google SignIn Api"))
            }
            await getUser(responseData.localId).then((user)=>{
              resolve(user)
            }).catch((error)=>{
              return reject(new Error("Error Fetching User from getUser Method"))
            })
          }).catch((error)=>{
            reject(new Error("Json Parsing Error"+error))
          })
        })
        .catch((error)=>{
          reject(new Error("Error in sign in through Google Api"))
        })
    })
}


export const getUser=async(uid:string):Promise<UserType>=>{
return {
  email:"dexter@gmail.com",
  name:"Dexter",
  role:"",
  vehicleCapacity:5,
  phone:"",
  uid:uid,
  vehicleStyle:"Pick Up"
}
}

export const createUser= async (newUserData:UserSignInType):Promise<boolean>=>{
   return await admin.auth().createUser({
    email:newUserData.email,
    password:newUserData.password, // default password, link will be sent to user to create add new password
  }).then(async (user)=>{
    return await db.collection('users').doc(user.uid).set({
      email:user.email
    }).then((result)=>true).catch(error=>false)
  }).catch(error=>false).finally(()=>false)

}
createUser({email:"harry@gmail.com",password:"password"}).then((r)=>console.log(r)).catch((s)=>console.log("error"))


//getUser("uid").then((x)=>console.log(x))

//signIn("harkiratsingh.tu@gmail.com","password").then((x)=>console.log(x)).catch((e)=>console.log(e))