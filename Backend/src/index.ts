import express from 'express';
import {config} from './config/index.js';
import userRoute from './api/routes/userRoute.js';
import postRoute from './api/routes/postRoute.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './api/routes/authRoute.js';
import { isAuthenticated } from './api/middleware/auth.js';

const app=express();
app.use(cors());

app.use(express.json());
app.use(cookieParser())

app.use("/user",userRoute);

app.use("/post",isAuthenticated,postRoute)
app.get("/",(req,res)=>{
    res.send("server is up")
})

app.use(errorHandler);
app.listen(config.port,()=>{
    console.log(`${config.port} is listening` );
})

export default app;