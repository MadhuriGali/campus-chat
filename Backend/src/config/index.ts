import dotenv from 'dotenv';

dotenv.config();

export const config={
    port:process.env.PORT,
    jwt_secret:process.env.JWT_SECRET,
    node_env:process.env.NODE_ENV,
    email_user:process.env.EMAIL_USER,
    email_pass:process.env.EMAIL_PASS
}
console.log("port is",process.env.PORT);