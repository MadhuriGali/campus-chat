import {PrismaClient} from '@prisma/client'
import AppError from "../utils/AppError.js";
import { Request} from 'express';
import jwt from 'jsonwebtoken';
import {config} from '../config/index.js';


const hour=60*60*1000;
const prisma=new PrismaClient();

function getNamefromMail(email:string){
    return email.substring(0, email.indexOf("@"));
}

export const getUser=(req:Request):any=>{
     const token=req.cookies.token;
     const secret=config.jwt_secret || "password"
     const user=jwt.verify(token,secret);
        return user;
}


export const createPosts=async(req:Request)=>{
    const user=getUser(req);
    const {subject,description,expiry}=req.body;
    const expireAt=new Date(new Date().getTime()+expiry*hour)
    const post=await prisma.posts.create({
        data:{
            Subject:subject,
            Description:description,
            Author:getNamefromMail(user.Email),
            ExpiresAt:expireAt,
            UserId:user.id
        }
    })
    if(!post) throw new AppError("Error occured while creating post",404)
        return post;

}


export const updatePosts=async (req:Request)=>{
   const {subject,description,expiry}=req.body;
   const {id}=req.params;
   const expireAt=new Date(new Date().getTime()+expiry*hour);
   const postIdNumber=parseInt(id,10)
   try{
    const newPost=await prisma.posts.update({
        where:{
            id:postIdNumber,
        },
        data:{
            Subject:subject,
            Description:description,
            ExpiresAt:expireAt,
        }
       })
       return newPost;
   }catch(err){
    throw new AppError("Error occured while updating post please try after sometime..!",404)
   }  
}


export const deletePosts=async (req:Request)=>{
    const {id}=req.params;
    const postIdNumber=parseInt(id,10)
   const post=await prisma.posts.delete({
    where:{
        id:postIdNumber
    }
   })
   if(!post) throw new AppError("No post found to delete",404)
    return post;
}



export const getLivePosts=async()=>{
   const posts=await prisma.posts.findMany({
    where:{
        ExpiresAt:{
            gt:new Date()
        }
    },
    orderBy:{
        ExpiresAt:'desc'
    }
   })
   if(!posts) throw new AppError("No post found ",404)
    return posts;
}




export const getLivePostByUser=async (req:Request)=>{
    const user=getUser(req);
    const posts=await prisma.posts.findMany({
        where:{
            UserId:user.id,
            ExpiresAt:{
                gt:new Date()
            }
        },
        orderBy:{
            ExpiresAt:'desc'
        }
    })
    if(!posts) throw new AppError("No post found ",404)
    return posts;
    
}