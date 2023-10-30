// const c = new Date().toUTCString()

// const nd = new Date()

// console.log(nd.toLocaleString())
// console.log(nd.toUTCString())

const t = ()=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve()
        },2000)
    })
}

const a =async ()=>{
    let x=1
    await t().then(()=>{x=x+1}).catch((erre)=>{})
    console.log(x)
    return x
}

const m =async ()=>{
    let b =  a()
    console.log(b)
}

m()