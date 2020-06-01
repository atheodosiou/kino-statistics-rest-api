import { Request, Response, NextFunction } from "express";
import {send} from "@sendgrid/mail";

export const sendMail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const msg = {
    to: 'pantelopantelos@gmail.com',
    from: "test@example.com",
    subject: "Sending with Twilio SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>"
  };
  send(msg);
  res.send("Mail Send");
};
