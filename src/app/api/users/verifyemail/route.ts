import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    console.log("Received token:", token);

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      console.log("No user found with the given token");
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    console.log("User verified successfully");
    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error in email verification:", error);
    return NextResponse.json({ message: "Server error during verification" }, { status: 500 });
  }
}