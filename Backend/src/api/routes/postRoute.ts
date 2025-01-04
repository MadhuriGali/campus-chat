import express from "express";
import {catchAsync} from '../../utils/catchAsync.js'
import { celebrate,Joi } from "celebrate";
import {createPosts,updatePosts,deletePosts,getLivePostByUser,getLivePosts} from '../../services/postService.js'
const router=express.Router();

router.get("/",(req,res)=>{
    res.json({msg:"post route working"})
})




router.post("/createPost",celebrate({
    body: Joi.object({
        subject:Joi.string().required(),
        description:Joi.string().required(),
        expiry:Joi.number().required()
        })
}),catchAsync(async(req,res)=>{
    const post=await createPosts(req);
    res.status(201).json({"msg":"post created successfully","post":post})

}))



router.put("/updatePost/:id",celebrate({
    body:Joi.object({
        subject:Joi.string().required(),
        description:Joi.string().required(),
        expiry:Joi.number().required()
    }),
    params:{
        id:Joi.number().required(),
    }
}),catchAsync(async(req,res)=>{
    const updatePost=await updatePosts(req);
    res.status(201).json({"msg":"post updated successfully","post":updatePost})
}))




router.delete("/deletePost/:id",celebrate({
    params:Joi.object({
        id:Joi.number().required(),
    })
}),catchAsync(async(req,res)=>{
    const deletedPost=await deletePosts(req);
    res.status(200).json({"msg":"post deleted successfully","post":deletedPost})
}))




router.get("/getAll",catchAsync(async(req,res)=>{
    const allPosts=await getLivePosts();
    res.status(200).json({"msg":"post fetched successfully","post":allPosts})
}))




router.get("/getByUser",catchAsync(async(req,res)=>{
    const userPost=await getLivePostByUser(req);
    res.status(200).json({"msg":"post fetched successfully","post":userPost})
}))

export default router;