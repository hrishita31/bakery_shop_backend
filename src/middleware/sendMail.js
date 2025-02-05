import nodemailer from 'nodemailer';
import { createTokenMiddleware } from './middleware.js';
import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const sendMail = async(user, req, res) => {
    const derivedEmail = user.email;
    console.log("derived mail: " ,derivedEmail);
    let testAccount = await nodemailer.createTestAccount();


    console.log("setting transporter")
    const transporter = await nodemailer.createTransport({
        host: 'smtp.gmail.com',
    port: 465,
    secure:true,
    auth: {
        user: '21bce089@nirmauni.ac.in',
        pass: process.env.PASSWORD_FOR_MAIL_SENDER,
    }
    });
    console.log("transporter set")

    const token = await createTokenMiddleware({ userId: user._id, username: user.username });
    console.log("token: ", token);

    const templatePath = path.join(__dirname, '..', 'template', 'forgotPassword.ejs');

    // console.log(`${process.env.URL_HEADER}`, 123)

        const emailHtml = await ejs.renderFile(templatePath, { 
            username : user.username,
            resetPasswordLink: `${process.env.URL_HEADER}/resetPassword?token=${token}` 
        });
     
        // console.log(`${process.env.URL_HEADER}/resetPassword?token=${token}` , 9876)

    
    const info = await transporter.sendMail({
    to: derivedEmail, // list of receivers
    subject: "Mail send test", // Subject line
    
   html : emailHtml
    })
    console.log("message sent: %s", info.messageId);

    
    // res.send(info);
}

export {sendMail};



