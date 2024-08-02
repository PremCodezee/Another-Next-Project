"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function VerifyEmail() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const verifyUserEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="rounded-md bg-white p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Verify your email address
            </h2>
            {verified && (
              <div className="mt-4">
                <p className="text-green-500">Your email address has been verified!</p>
                <Link href="/login">
                  <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Login
                  </button>
                </Link>
              </div>
            )}
            {error && (
              <div className="mt-4">
                <p className="text-red-500">{error}</p>
              </div>
            )}
            {!verified && !error && (
              <p className="mt-4 text-gray-500">Verifying your email...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}