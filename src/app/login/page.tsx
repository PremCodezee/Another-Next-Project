"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Signup() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onLogin = async () => {};

  return (
    <div className="p-5">
      <h1 className="text-center text-3xl font-bold rounded-2xl bg-green-200 text-green-600 p-5">
        Login
      </h1>
      <div className="flex items-center justify-center max-h-screen">
  <div className="p-10 text-lg flex flex-col w-2/5 bg-green-200 mt-10 rounded-2xl">
    
    <label className="text-center text-lg p-3" htmlFor="email"> Email </label>
    <input
      type="email"
      id="email"
      value={user.email}
      onChange={(e) => setUser({ ...user, email: e.target.value })}
      className="border-2 border-green-500 rounded-lg p-2 w-4/5 mx-auto"
    />

    <label className="text-center text-lg p-3" htmlFor="password"> Password </label>
    <input
      type="password"
      id="password"
      value={user.password}
      onChange={(e) => setUser({ ...user, password: e.target.value })}
      className="border-2 border-green-500 rounded-lg p-2 w-4/5 mx-auto"
    />
    <button className="bg-green-500 text-white rounded-lg p-2 mt-5 w-4/5 mx-auto" onClick={onLogin}>Login</button> 
    <Link className="text-center text-lg p-3" href="/signup">Don't have an account? <b>Signup</b></Link>
  </div>
</div>

    </div>
  );
}
