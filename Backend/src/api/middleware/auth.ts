
import { Request} from 'express';
import {config} from '../../config/index.js';
import expressjwt  from "express-jwt";


const getToken = (req: Request): string => {
    const token = req.cookies ? req.cookies.token : '';
    return token;
}


const checkIsRevoked=(req:Request,token:any):boolean=>{
    try{
        return(token.expiresAt>new Date(Date.now()));
    }catch(error) {
        return false;
    }
}

  export  const isAuthenticated=expressjwt.expressjwt({
    secret:config.jwt_secret || 'password',
    algorithms: ['HS256'],
    credentialsRequired:true,
    getToken:getToken,
    isRevoked:checkIsRevoked,

    
   })
   console.log("authenticated");
   
