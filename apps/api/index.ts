import express from "express"
import dotenv from "dotenv"
dotenv.config();


import driverRouter from './routes/driver'
import adminRouter from './routes/admin'
import authRouter from "./routes/auth"

//import testRouter from "./routes/test"
import cors from "cors"



const app = express()
app.use(cors());

const port = process.env.PORT

app.use(express.json())
app.use("/driver", driverRouter)
app.use("/auth", authRouter)
app.use("/admin", adminRouter)
//app.use("/test",testRouter)

app.listen(port, () => console.log(`Running at port ${port}`))