import express from "express";
import cors from 'cors'
import gigs from './endPoints/gigs.js'
import bids from './endPoints/bids.js'
import otp from './endPoints/otp.js'
import {auth} from './middlewares/authIn.js'
import 'dotenv/config'
import path from 'path'
import Auth from './endPoints/auth.js'
import cookieParser from "cookie-parser";
import { ModelMessages, ModelSid } from "./mongoose/mongooseValidationPlusModelCreation.js";
import { app, httpServer } from "./socket.js";

const PORT = process.env.PORT || 10000;
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(express.json())
app.use(cookieParser(process.env.SECRET))
app.use('/api/auth',Auth)
app.use('/api/otp',otp)
app.use('/api/gigs',auth,gigs)
app.use('/api/bids',auth,bids)
app.get('/api/messages',auth,async(req,res)=>{
    const {sid}=req.signedCookies 
    const id=await ModelSid.findOne({_id:sid})
    const data=await ModelMessages.find({to:id.someId})
    res.status(200).json(data)
})
// ------------code for deployment---------------------
if(process.env.NODE_ENV==='production'){
const dirPath=path.resolve()
app.use(express.static("./frontend/dist"))
app.get("*all",(req,res)=>{
    res.sendFile(path.resolve(dirPath,"./frontend/dist","index.html"))
})
}
httpServer.listen(PORT,'0.0.0.0',()=>{
    console.log(`server started on port ${PORT}`)
})