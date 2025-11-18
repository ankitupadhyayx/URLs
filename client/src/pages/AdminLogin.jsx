import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin({ backendUrl = "https://urls-backend-cm9v.onrender.com" }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    const captchaToken = "MOCK_RECAPTCHA_TOKEN_12345";

    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, captchaToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Invalid credentials or bot check failed");
      }

      const data = await res.json();
      localStorage.setItem("admin-token", data.token);
      navigate("/admin");
    } catch (e) {
      setErr(e.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={submit}
        className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md border border-gray-200"
      >
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>

        {/* Username */}
        <label className="block mb-2 text-gray-700 font-medium">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter your username"
        />

        {/* Password */}
        <label className="block mb-2 text-gray-700 font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter your password"
        />

        {/* CAPTCHA Note */}
        <div className="text-xs text-gray-500 text-center mb-3">
          reCAPTCHA v3 active — invisible bot protection
        </div>

        {/* Error */}
        {err && (
          <div className="text-red-600 bg-red-100 border border-red-300 p-2 rounded-lg mb-4 text-center">
            {err}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
