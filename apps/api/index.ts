import express from "express"
import dotenv from "dotenv"
dotenv.config();
import driverRouter from './routes/driver'
import adminRouter from './routes/admin'
import authRouter from "./routes/auth"
import cors from "cors"
import { connectDB } from "mongoose-db";


export const app = express()
connectDB();
app.use(cors());

app.use(express.json())
app.use("/driver", driverRouter)
app.use("/auth", authRouter)
app.use("/admin", adminRouter)

