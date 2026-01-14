import express from 'express'
import nodemailer from 'nodemailer'
import {ModelLogin, ModelOtp } from '../mongoose/mongooseValidationPlusModelCreation.js'


const server = express.Router()

server.put('/', async (req, res) => {
  const { email, name } = req.body
  const exists =await ModelLogin.findOne({name,email})
  if (exists) {
    return res.json({ mess: 'User already exists' })
  }
  const otp = Math.floor(1000 + Math.random() * 9000)
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: `${process.env.userEmail}`,
        pass: process.env.pass
      }
    })

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'GigFlow',
      text: `Your OTP is ${otp}`   
    })
    await ModelOtp.create({email,otp})
    res.json({ mess: 'OTP sent' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ mess: 'Failed to send OTP' })
  }
})

export default server
