"use client";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get("/api/users/meuser");
      setUser(response.data.data._id);
      console.log('data has arrived', response.data.data);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-center text-3xl font-bold rounded-2xl bg-green-200 text-green-600 p-5">
        Profile
      </h1>
  
  <div className="flex m-5 flex-col justify-center items-center">
  <h2 className="text-white font-bold italic mt-5 rounded-xl underline text-2xl p-10 bg-orange-400">
        {user === null ? "User not found" : <h2>ID: {user}</h2> }
      </h2>
      <div className="m-5">
      <Link  href={`/profile/${user}`}>
      <span className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded">View Profile</span> 
      </Link>
      </div>
  </div>
     
     <div className="flex justify-center items-center">
     <button 
        onClick={logout}
        className="bg-blue-500  hover:bg-blue-700 text-white font-bold py-4 px-8 rounded" 
      >
        Logout
      </button>

     </div>
    
    </div>
  );
}
