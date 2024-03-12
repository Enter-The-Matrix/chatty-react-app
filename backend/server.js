import express  from "express";
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'

import connectToMongoDB from './db/connectToMongoDB.js'
import { app,server } from "./socket/socket.js"

const PORT = process.env.PORT || 5000

dotenv.config()

// app.get('/',(req , res)=>{
//     res.send("HELLO WORLD")
// })

app.use(express.json()) //to parse incoming request with json payload
app.use(cookieParser()) // to read cookies


app.use("/api/auth/",authRoutes)
app.use("/api/messages/",messageRoutes)
app.use("/api/users/",userRoutes)






server.listen(PORT,()=>{
    connectToMongoDB()
    console.log("Server is running on port:", PORT);
})