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
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }
      const data = await res.json();
      // Save token
      localStorage.setItem("admin-token", data.token);
      // redirect to admin
      navigate("/admin");
    } catch (e) {
      setErr(e.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-900">
      <form onSubmit={submit} className="bg-neutral-800 p-8 rounded-xl w-96">
        <h2 className="text-white text-2xl mb-4">Admin Login</h2>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-3 rounded mb-3 bg-neutral-700 text-white"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 rounded mb-3 bg-neutral-700 text-white"
        />

        {err && <div className="text-red-400 mb-2">{err}</div>}

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
