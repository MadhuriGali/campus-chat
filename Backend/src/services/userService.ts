 import {PrismaClient} from '@prisma/client'
import AppError from "../utils/AppError.js";
import {generateOtp} from '../utils/generateOTP.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {config} from '../config/index.js';
import sendEmail from './mailService.js'
import { Request} from 'express';
import { getUser } from './postService.js';
const prisma=new PrismaClient();
const day = 24*60*60*1000;

interface body{
    email:string,
    password:string
}
type userType={
    otp: number;
    otpExpiresAt: Date;
    id: number;
    Email: string;
    Password: string;
    Status: string;
}

const generateToken=(user:userType):string=>{
    const {id,Email}=user;
    const expiresAt=config.node_env==="dev"?new Date(Date.now()+day):new Date(Date.now()+7*day);
    if (!config.jwt_secret) {
        throw new AppError("JWT Secret is not configured",401);
    }
    const token=jwt.sign({id,Email,expiresAt},config.jwt_secret);
    return token;
}

const tokenFromUser=(user:userType)=>{
    const token=generateToken(user);
    Reflect.deleteProperty(user, 'Password');
    Reflect.deleteProperty(user, 'otp');
    Reflect.deleteProperty(user, 'otpExpiresAt');
    return {token,user};
}

export const signup=async ({email,password}:body)=>{
    if(!email || !password){
        throw new AppError("All fields must be filled",409)
    }
    const  {otp,otpExpiresAt}=generateOtp();

    const existingUser=await prisma.user.findFirst({
        where: { Email:email },
      });

      console.log("user is",existingUser)
      if(existingUser) throw new AppError("User with this email already exists",409);

      const salt=await bcrypt.genSalt();
      const hashedPassword=await bcrypt.hash(password,salt);
      console.log("hashed password",hashedPassword)
      const user=await prisma.user.create({
        data:{
            Email:email,
            Password:hashedPassword,
            otp,
            otpExpiresAt
        }
      })

      try{
        await sendEmail({
            email:user.Email,
            subject:"OTP for Campus-Chats email verfication",
            html:`<html>
                <body> 
                <h3> Welcome to Campus Chats!!</h3> 
                <h2>
                 Your OTP is ${user.otp}
                </h2>
                </body>
                </html>`
        })
      }catch(error){
        console.log("there is an errrr while sending an email. please try again..!",error)
        return new AppError("there is an errrr while sending an email. please try again..!",500)
      }
    
      return tokenFromUser(user);
}


export const login=async(email:string,password:string)=>{

    const userExists=await prisma.user.findFirst({
        where: {Email:email},
    
    });
    if(!userExists) throw new AppError("User with email not found please sign up....!",401);

    if(userExists && userExists.Status==="pending")throw new AppError("Sign in Failed. User Email Address is not confirmed yet",401);

    const passwordMatch=await bcrypt.compare(password,userExists.Password);
    if(!passwordMatch)  throw new  AppError("Incorrect password",404);
    return tokenFromUser(userExists);
}

export const validate=async(req:Request)=>{
    const {otp}=req.body;
    const user=getUser(req);
    const userExists=await prisma.user.findFirst({
        where:{
            id:user.id
        },
        select:{
            otp:true,
            otpExpiresAt:true
        }
     })
    if(otp!==userExists?.otp) throw new AppError("Please enter correct OTP",404);
    await prisma.user.update({
        where:{
            id:user.id,
        },
        data:{
            Status:"confirmed"
        }
       })
    return userExists;
}