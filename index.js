import express from "express"
import cors from "cors"

import {connect} from "./config/connect.js"
import quoteRouter from "./routers/quotes.router.js"
import dotenv from "dotenv"
dotenv.config();

const PORT = process.env.PORT || 5001
const app = express()

connect()

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(express.json())

app.use("/api/quote" , quoteRouter)

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`)
})