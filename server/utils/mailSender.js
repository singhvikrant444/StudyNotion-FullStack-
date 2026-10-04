const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
    try{
        const transporter = nodemailer.createTransport({
            host: 'process.env.MAIL_HOST',
            auth: { 
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
       let info= await transporter.sendMail({
            from: process.env.USER,
            to: `${email}`, 
            subject: `${title}`,
            text: `${body}`,
       });
       console.log("Mail sent successfully", info);
       return info;
    }
    catch(err){
        console.log("Error in mail sender", err);
    }
}

module.exports = mailSender;