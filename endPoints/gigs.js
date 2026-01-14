import express from "express"
import { ModelBid, ModelGig, ModelLogin, ModelSid } from "../mongoose/mongooseValidationPlusModelCreation.js"
import jwt from 'jsonwebtoken'
import mongoose from "mongoose"
import 'dotenv/config'

const server = express.Router()
server.get('/',async(req,res)=>{
    const {sid}=req.signedCookies  
    const dataAll=await ModelGig.find({},'title budget description status ownerId')
    res.status(200).json({dataAll})
})
server.post('/',async(req,res)=>{
   const {sid}=req.signedCookies 
    const {title,description,price:budget}=req.body
    const id=await ModelSid.findOne({_id:sid}).lean()
    await ModelGig.create({title,description,budget,ownerId:id.someId,status:'open'})
    res.status(200).json({mess:'created successfully'})
})
server.get('/myGigs',async(req,res)=>{
    const {sid}=req.signedCookies 
    const id=await ModelSid.findOne({_id:sid}).lean()
    const data=await ModelGig.find({ownerId:id.someId},'title budget description status ownerId')
    res.status(200).json(data)
})
server.post('/statusChange',async(req,res)=>{
  const {sid}=req.signedCookies 
  const {gigId,freelancerId}=req.body
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await ModelGig.findOneAndUpdate({ _id: gigId },{ status: 'assigned' },{ session })
      await ModelBid.findOneAndUpdate({ gigId, freelancerId },{ status: 'hired' },{ session })
      await ModelBid.updateMany({ gigId, status: 'pending' },{ $set: { status: 'rejected' } },{ session })})
    res.status(200).json({ mess:'updated'})
  } catch (error) {
    res.status(500).json({ mess:'Transaction failed', error: error.message })
  } finally {
    await session.endSession()
  }
})
export default server