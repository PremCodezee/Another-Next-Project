import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    console.log("Starting sendMail function");
    console.log("Environment variables:", {
      DOMAIN: process.env.DOMAIN,
      MAILTRAP_USER: process.env.MAILTRAP_USER ? "Set" : "Not set",
      MAILTRAP_PASS: process.env.MAILTRAP_PASS ? "Set" : "Not set",
      EMAIL_FROM: process.env.EMAIL_FROM,
    });

    const randomToken = crypto.randomBytes(32).toString("hex");
    console.log("Generated random token");

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: randomToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
      console.log("Updated user with verify token");
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgetPasswordToken: randomToken,
        forgetPasswordTokenExpiry: Date.now() + 3600000,
      });
      console.log("Updated user with reset token");
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
    console.log("Created nodemailer transporter");

    const verificationLink = `${process.env.DOMAIN}/verifyemail?token=${randomToken}`;
    console.log("Verification link:", verificationLink);

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
        <p>Please ${emailType === "VERIFY" ? "verify your email" : "reset your password"} by clicking the link below:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };
    console.log("Prepared mail options");

    const mailResponse = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", mailResponse);
    return mailResponse;
  } catch (error: any) {
    console.error("Detailed error in sendMail:", error);
    console.error("Error stack:", error.stack);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};