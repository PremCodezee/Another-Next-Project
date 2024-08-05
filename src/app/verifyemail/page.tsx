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
  const [countdown, setCountdown] = useState(8);
  const router = useRouter();

  const verifyUserEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
      startCountdown();
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('token') || "";
    setToken(urlToken);
  }, []);

  useEffect(() => {
    if (token) {
      verifyUserEmail();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify your email address</h1>
      <div className="mt-4">
        {verified && (
          <div className="text-center">
            <h2 className="text-2xl text-green-500">Your email address has been verified!</h2>
            <p>Redirecting to home page in {countdown} seconds...</p>
            <Link href="/profile" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
              Go to Profile
            </Link>
          </div>
        )}
        {error && (
          <div className="text-red-500">
            {error}
          </div>
        )}
        {!verified && !error && (
          <div>Verifying your email...</div>
        )}
      </div>
    </div>
  );
}