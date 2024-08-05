"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function VerifyEmail() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const verifyUserEmail = async () => {
    try {
      setLoading(true);
      console.log("Attempting to verify email with token:", token);
      const response = await axios.post("/api/users/verifyemail", { token });
      console.log("Verification response:", response.data);
      setVerified(true);
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error: any) {
      console.error("Verification error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('token') || "";
    console.log("Token from URL:", urlToken);
    setToken(urlToken);
  }, []);

  useEffect(() => {
    if (token) {
      verifyUserEmail();
    } else {
      setLoading(false);
      setError("No verification token found");
    }
  }, [token]);

  if (loading) {
    return <div>Verifying your email...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Email Verification</h1>
      {verified && (
        <div className="text-center">
          <h2 className="text-2xl text-green-500 mb-2">Your email has been verified successfully!</h2>
          <p>Redirecting to home page...</p>
        </div>
      )}
      {error && (
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <Link href="/signup" className="text-blue-500 hover:underline">
            Back to Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}