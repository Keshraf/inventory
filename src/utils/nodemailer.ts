import nodemailer, { type SendMailOptions } from "nodemailer";

const email = process.env.EMAIL;
const sendEmail = process.env.SEND_EMAIL;
const ccEmail = process.env.CC_EMAIL;
const password = process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: password,
  },
});

export const mailOptions: SendMailOptions = {
  from: email,
  to: sendEmail,
  cc: ccEmail,
};
