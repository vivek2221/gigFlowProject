import { ModelSid } from "../mongoose/mongooseValidationPlusModelCreation.js"
import 'dotenv/config'

export const auth = async(req,res,next)=>{
    
    const {sid}=req.signedCookies
    if(sid){
        const find=await ModelSid.findOne({_id:sid})
        if(find){
            return next()
        }
        res.clearCookie('sid',{
            httpOnly:true,
        sameSite:process.env.SAMESITE,
        secure:process.env.SECURE==='true',
        signed:true,
        })
        return res.status(401).json({mess:'reLogin'})
    }
    else{
        return res.status(401).json({mess:'reLogin'})
    }
}