import nodemailer from 'nodemailer';
import {config} from '../config/index.js';

const sendEmail=async(options:any)=>{
    const transporter=nodemailer.createTransport({
        // service:'Gmail',
        host: 'smtp.gmail.com',
        port: 587, // Changed frocm 465 to 587
        secure: false, // Changed from true to false for TLS
        auth: {
            user: config.email_user,
            pass: config.email_pass
        },
        tls: {
            rejectUnauthorized: true,
            ciphers: 'SSLv3'
        },
        debug: true ,
        connectionTimeout: 30000, // Adding timeout of 30 seconds
        greetingTimeout: 30000,
        socketTimeout: 30000 
    })
    const mailOptions={
        from:`"mail" <madhurigali17@gmail.com>`,
        to:options.email,
        subject:options.subject,
        html:options.html
    }
    try {
        // Test the connection
        await new Promise((resolve, reject) => {
            transporter.verify((error, success) => {
                if (error) {
                    console.error('Verification error:', error);
                    reject(error);
                } else {
                    console.log('Server is ready to take messages');
                    resolve(success);
                }
            });
        });

        // If verification successful, send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        
    } catch (error) {
        console.error('Email sending failed:', error);
        
    }
}



export default sendEmail;