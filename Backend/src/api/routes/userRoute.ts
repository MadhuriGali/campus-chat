import express from "express";
import {signup,login,validate} from '../../services/userService.js';
import {catchAsync} from '../../utils/catchAsync.js'
import { celebrate,Joi } from "celebrate";
import { userInfo } from "os";

const router=express.Router();
const day = 24*60*60*1000;


router.post("/signUp",celebrate({
    body:Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().required()
    })
}) ,catchAsync(async(req,res)=>{
    const result = await signup(req.body);
    if ('token' in result && 'user' in result) {
        const { token, user } = result;
        const expires = process.env.NODE_ENV == 'dev' ?  day : 7*day;
        const secure=process.env.NODE_ENV == 'production'
        res.cookie("token",token,{maxAge:expires,secure,httpOnly:true}).json({"user":user});
    } else {
        // Handle the error case
        res.status(400).json({ error: 'Signup failed' });
    }

}));





router.post("/login",celebrate({
    body:Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().required()

    })
}),catchAsync(async(req,res)=>{
    const {email,password}=req.body
    const {token,user}=await login(email,password);
    const expires = process.env.NODE_ENV == 'dev' ?  day : 7*day;
    const secure=process.env.NODE_ENV == 'production'
    res.cookie("token",token,{maxAge:expires,secure,httpOnly:true}).json({"user":user})
}));




router.post("/validate",celebrate({
    body:Joi.object({
        otp:Joi.number().required()

    })
}),
catchAsync(async(req,res)=>{
    const response=await validate(req);
    res.status(200).json({"msg":"Thanks for entering correct opt","user":response})
}));




export default router;