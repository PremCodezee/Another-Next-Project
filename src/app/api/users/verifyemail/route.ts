import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    
    if (!token) {
      return NextResponse.json({ status: 400, message: "Token is required" });
    }

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ status: 400, message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({
      status: 200,
      message: "Email verified successfully",
    });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({
      status: 500,
      message: "An error occurred during verification",
    });
  }
}