import {ErrorRequestHandler} from 'express'
const errorHandler:ErrorRequestHandler=(err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const status=err.status;

    res.status(statusCode).json({
       status:err.status,
       msg:err.status || "something went wrong"

    })

}

export default errorHandler;