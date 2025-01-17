import {vi} from "vitest"


export const signIn = vi.fn().mockImplementation((email:string,password:string)=>{
    console.log("Mocking.....")
    if (email===process.env.TEST_EMAIL && password===process.env.TEST_PASSWORD)
        return Promise.resolve({
            user:{name:"Harkirat"}
         })
    else {
        return Promise.reject("Wrong Credentials")
    }
})
