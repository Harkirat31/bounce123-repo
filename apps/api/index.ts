import express from "express"
import dotenv from "dotenv"
dotenv.config();


import userRouter from './routes/user'
import adminRouter from './routes/admin'
import authRouter from "./routes/auth"
import cors from "cors"



const app = express()
app.use(cors());

const port = process.env.PORT

app.use(express.json())
app.use("/user", userRouter)
app.use("/auth", authRouter)
app.use("/admin", adminRouter)

app.listen(port, () => console.log(`Running at port ${port}`))