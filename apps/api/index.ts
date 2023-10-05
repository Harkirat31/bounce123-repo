import express from "express"
import dotenv from "dotenv"
dotenv.config();

import adminRouter from './routes/user'

const app = express()

const port = process.env.PORT

app.use(express.json())
app.use("/admin", adminRouter)

app.listen(port,()=>console.log(`Running at port ${port}`))