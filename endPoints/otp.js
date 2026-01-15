import express from 'express'
import nodemailer from 'nodemailer'
import 'dotenv/config'
import {ModelLogin, ModelOtp } from '../mongoose/mongooseValidationPlusModelCreation.js'
import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo"

let emailAPI = new TransactionalEmailsApi();
emailAPI.authentications.apiKey.apiKey = process.env.API_KEY
const server = express.Router()
server.put('/', async (req, res) => {
  const { email, name } = req.body
  const exists =await ModelLogin.findOne({name,email})
  if (exists) {
    return res.json({ mess: 'User already exists' })
  }
  const otp = Math.floor(1000 + Math.random() * 9000)
  try {
    let message = new SendSmtpEmail();
message.subject = "gigFlow";
message.textContent = `your otp is ${otp}`;
message.sender = { name: "gigFlow", email: process.env.USEREMAIL };
message.to = [{ email, name }];
    emailAPI.sendTransacEmail(message)
    await ModelOtp.create({email,otp})
    return res.json({ mess: 'OTP sent' })
  } catch (err) {
    res.status(500).json({ mess: 'Failed to send OTP' ,err})
  }
})

export default server
