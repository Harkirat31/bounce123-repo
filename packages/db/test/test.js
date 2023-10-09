const a =()=>{
    return new Promise(async (res,rej)=>{
         await sleep(2000)
         res("resolve")
        
    })
}

function sleep(ms){
    return new Promise((res)=>setTimeout(res,ms))
}

const b=async ()=>{
    return  a().then((x)=> {
        console.log(x)
        return "yo"
    })
}

a().then((x)=>console.log(x))
b().then((x)=>console.log(x))