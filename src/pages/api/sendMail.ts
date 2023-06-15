// pages/api/sendEmail.js

import { transporter, mailOptions } from "@/utils/nodemailer";
import { NextApiRequest, NextApiResponse } from "next";
import { type SendMailOptions } from "nodemailer";

type Request = NextApiRequest & {
  body: {
    subject: string;
    text: string;
  };
};

export default async function handler(req: Request, res: NextApiResponse) {
  if (req.method !== "POST" || true) {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const data = JSON.parse(req.body);

  const mail: SendMailOptions = {
    ...mailOptions,
    subject: data.subject,
    text: data.text,
  };

  try {
    await transporter.sendMail(mail);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "An error occurred while sending the email" });
  }
}
