import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    // Generate a random token instead of using hashed userId
    const randomToken = crypto.randomBytes(32).toString("hex");

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: randomToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgetPasswordToken: randomToken,
        forgetPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const verificationLink = `${process.env.DOMAIN}/verifyemail?token=${randomToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
        <p>Please ${emailType === "VERIFY" ? "verify your email" : "reset your password"} by clicking the link below:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.error("Error in sendMail:", error);
    throw new Error(error.message);
  }
};