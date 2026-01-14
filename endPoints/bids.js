import express from 'express'
import { ModelBid, ModelGig, ModelSid } from '../mongoose/mongooseValidationPlusModelCreation.js'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
const server=express.Router()
server.get('/:gigId',async(req,res)=>{
    const {sid}=req.signedCookies 
    const {gigId}=req.params
    const data=await ModelBid.find({gigId})
    res.status(200).json(data)
})
server.post('/',async(req,res)=>{
    const {gigId,message,price,status}=req.body
    const {sid}=req.signedCookies 
    const findFreelancer=await ModelSid.findOne({_id:sid})
    const title=await ModelGig.findOne({_id:gigId})
    await ModelBid.create({gigId,freelancerId:findFreelancer.someId,title:title.title,message,price,status})
    return res.status(200).json({mess:'send the bid successfully'})
})

export default server