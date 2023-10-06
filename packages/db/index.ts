import * as admin from 'firebase-admin';
// Initialize Firebase Admin SDK

admin.initializeApp({
  credential: admin.credential.cert("serviceAccount.json"),
});

const db = admin.firestore();

async function getData(){
    const x =  await db.collection('test').doc("1").get()
    console.log(x);
}

getData()