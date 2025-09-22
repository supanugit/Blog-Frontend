"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {};

export default function LoginPage({}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("⚠️ Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        { email, password },
        {
          withCredentials: true, // 👈 allows cookies from backend
        }
      );

      setMessage("✅ Login successful!");
      router.replace("/");
      // If you ALSO want to store token manually (e.g., for axios headers):
      // localStorage.setItem("token", res.data.token);

      console.log("Response:", res.data);
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2">Login</h2>

        <input
          placeholder="Enter your email"
          className="p-2 rounded bg-gray-700 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="p-2 rounded bg-gray-700 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold">
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p className="text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}
