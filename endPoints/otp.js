import express from 'express'
import nodemailer from 'nodemailer'
import 'dotenv/config'
import {ModelLogin, ModelOtp } from '../mongoose/mongooseValidationPlusModelCreation.js'


const server = express.Router()
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USEREMAIL,
    pass: process.env.PASS 
  }
})
server.put('/', async (req, res) => {
  console.log('firstError')
  const { email, name } = req.body
  const exists =await ModelLogin.findOne({name,email})
  if (exists) {
    console.log('second')
    return res.json({ mess: 'User already exists' })
  }
  const otp = Math.floor(1000 + Math.random() * 9000)
  console.log('generated')
  try {
    await transporter.sendMail({
      from: process.env.USEREMAIL,
      to: email,
      subject: 'GigFlow',
      text: `Your OTP is ${otp}`   
    })
    console.log('transporter')
    await ModelOtp.create({email,otp})
    console.log('model err')
    res.json({ mess: 'OTP sent' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ mess: 'Failed to send OTP' })
  }
})

export default server
