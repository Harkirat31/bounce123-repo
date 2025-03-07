import {vi} from "vitest"
import { TEST_EMAIL, TEST_PASSWORD } from "../fixtures/dummy_credentials"


export const signIn = vi.fn().mockImplementation((email:string,password:string)=>{
    if (email===TEST_EMAIL && password===TEST_PASSWORD)
        return Promise.resolve({
            user:{name:"Dummy User"}
         })
    else {
        return Promise.reject("Wrong Credentials")
    }
})
