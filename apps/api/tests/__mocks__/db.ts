import {vi} from "vitest"


export const signIn = vi.fn().mockImplementation((email:string,password:string)=>{
    if (email===process.env.TEST_EMAIL && password===process.env.TEST_PASSWORD)
        return Promise.resolve({
            user:{name:"Dummy User"}
         })
    else {
        return Promise.reject("Wrong Credentials")
    }
})
