import { nodemailer,dotenv } from '../index.js';
dotenv.config();
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});


const sendMail = (toEmail, subject, emailBody) => {
    return new Promise(function (resolve, reject) {
        const mailing = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: subject,
            html: emailBody,
        };
        transporter.sendMail(mailing, (err, data) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(1);
            }
        });
    });
};

export {
    sendMail
};