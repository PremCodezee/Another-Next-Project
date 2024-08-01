import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        error: "User not found",
        status: 400,
        success: false,
      });
    }

    // check if password matches
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({
        error: "Incorrect password",
        status: 400,
        success: false,
      });
    }

    // token data
    const tokenData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    // Generate token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    // Return success response without exposing full user object
    const response = NextResponse.json({
      message: "User logged in successfully",
      success: true,
      status: 200,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({
      error: "An error occurred during login",
      status: 500,
      success: false,
    });
  }
}
