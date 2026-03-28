import { envServer } from "@/data/env/server";
import nodemailer from "nodemailer";

export type EmailDataProps = {
  user: {
    name: string;
    email: string;
  };
  url: string;
};

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: envServer.SMTP_USER,
    pass: envServer.SMTP_PASS,
  },
});
