import express from 'express'
import nodemailer from 'nodemailer'
import 'dotenv/config'
import {ModelLogin, ModelOtp } from '../mongoose/mongooseValidationPlusModelCreation.js'
import { Resend } from 'resend'

const resend = new Resend(process.env.USEREMAIL)
const server = express.Router()
server.put('/', async (req, res) => {
  const { email, name } = req.body
  const exists =await ModelLogin.findOne({name,email})
  if (exists) {
    return res.json({ mess: 'User already exists' })
  }
  const otp = Math.floor(1000 + Math.random() * 9000)
  try {
   await resend.emails.send({
  from: "onboarding@resend.dev",
  to: email,
  subject: 'GigFlow',
  html: `<p>your otp is<strong>${otp}</strong>!</p>`
})
    await ModelOtp.create({email,otp})
    return res.json({ mess: 'OTP sent' })
  } catch (err) {
    res.status(500).json({ mess: 'Failed to send OTP' ,err})
  }
})

export default server
