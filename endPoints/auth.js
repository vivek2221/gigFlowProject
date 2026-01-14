import express from 'express'
import 'dotenv/config'
import {ModelLogin, ModelOtp, ModelSid} from '../mongoose/mongooseValidationPlusModelCreation.js'
const sameSite=process.env.SAMESITE
const secure=process.env.SECURE==='true'
const server=express.Router()
async function loginFunction(res,req,name,email,password,otp){
   const nameCheck=await ModelLogin.findOne({name})
      if(nameCheck){
         return res.json({mess:'user with userName already exists'})
      }
   const existsOtp=await ModelOtp.findOne({email,otp})
  if(existsOtp){
     await ModelLogin.insertOne({name,email,password}) 
     return res.json({mess:'go',name})
    } 
    else{
      return res.json({mess:'enter correct otp'})
    } 
}
server.post('/register',async(req,res)=>{
   const {name,email,password,otp}=req.body
       await loginFunction(res,req,name,email,password,otp)
})
server.post('/login',async(req,res)=>{
     const cookies=req.signedCookies.sid
     const {name,email,password}=req.body
     const findingsid=await ModelSid.findOne({_id:cookies})
     if(findingsid){
        return res.json({mess:'go',name:findingsid.name})
     }
     else{
        const found = await ModelLogin.findOne({name,email,password})
        if(found){
        const sessionId=await ModelSid.create({someId:found.id,name,TypeOfLoginSid:'ModelNormal'})
     res.cookie('sid',sessionId._id.toString(),{
      httpOnly:true,
        sameSite:sameSite,
        secure:secure,
        signed:true,
         maxAge:60*1000*60*60*10
     })
        return res.json({mess:'go',name})
   }
    else{
        return res.json({mess:'invalid credentials'})
    }
     }
})
export default server