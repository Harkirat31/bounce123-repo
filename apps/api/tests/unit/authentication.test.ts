import {it,describe,expect,vi} from "vitest"
import request from "supertest"
import dotenv from "dotenv"
import { signIn } from "../__mocks__/db";
import {app} from "../../index"
import { TEST_EMAIL, TEST_PASSWORD } from "../fixtures/dummy_credentials";
dotenv.config();


//mocking of db package to ensure unit testing
vi.mock("db",()=>({
    signIn
}))




describe("/post sign in with email and password",()=>{
    // it("Testing with Correct Email and password",async ()=>{
       
    //     const userEmail = TEST_EMAIL
    //     const userPassword = TEST_PASSWORD
    //     const res = await request(app).post("/auth/signin").send({
    //         email:userEmail,
    //         password:userPassword
    //     })
    //     expect(res.statusCode).toBe(201)
    //     expect(res.body.message).toBe("Login successfully")
    //     expect(res.body.token).toBeTypeOf("string")
    //     expect(signIn).toHaveBeenCalledTimes(1);
    //     expect(signIn).toHaveBeenCalledWith(userEmail, userPassword);
    // })

    it("/post sign in with wrong email and password",async ()=>{

        const userEmail = TEST_EMAIL
        const res = await request(app).post("/auth/signin").send({
            email:userEmail,
            password:"dummy"
        })
        expect(res.statusCode).toBe(401)
    })

})

