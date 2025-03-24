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
    console.log(derivedEmail, "derived mail");
    let testAccount = await nodemailer.createTestAccount();

    const transporter = await nodemailer.createTransport({
        host: 'smtp.gmail.com',
    port: 465,
    secure:true,
    auth: {
        user: 'hrishita.3134@gmail.com',
        pass: process.env.PASSWORD_FOR_MAIL_SENDER,
    }
    });

    const token = await createTokenMiddleware({ userId: user._id, username: user.username });

    const templatePath = path.join(__dirname, '..', 'template', 'forgotPassword.ejs');

    const emailHtml = await ejs.renderFile(templatePath, { 
        username : user.username,
        resetPasswordLink: `${process.env.URL_HEADER}/resetPassword?token=${token}` 
    });

    const mailOptions = {
        from : 'hrishita.3134@gmail.com',
        to : derivedEmail,
        subject : "Reset password link",
        html : emailHtml
    }
    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
    console.log("hi")
//     const info = await transporter.sendMail({
//     to: derivedEmail, // list of receivers
//     subject: "Mail send test", // Subject line
    
//    html : emailHtml
//     })
//     console.log("hi")
}

export {sendMail};



