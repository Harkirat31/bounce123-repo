import express from "express"
import dotenv from "dotenv"
dotenv.config();

import userRouter from './routes/user'
//import adminRouter from './routes/admin'
import authRouter from "./routes/auth"

const app = express()

const port = process.env.PORT

app.use(express.json())
app.use("/user", userRouter)
app.use("/auth",authRouter)

app.listen(port,()=>console.log(`Running at port ${port}`))