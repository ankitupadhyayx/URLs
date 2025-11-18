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
    
    // --- CAPTCHA Integration Logic Placeholder ---
    // In a real application, you would call a reCAPTCHA function here
    // to get a token, especially for v3 (no visible challenge).
    const captchaToken = "MOCK_RECAPTCHA_TOKEN_12345"; // Placeholder token
    // ---------------------------------------------
    
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // NOTE: Sending the captchaToken along with credentials
        body: JSON.stringify({ username, password, captchaToken }), 
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // Server would typically return 'Invalid credentials' OR 'CAPTCHA failed'
        throw new Error(data.error || "Login failed due to bad credentials or bot detection"); 
      }

      const data = await res.json();
      localStorage.setItem("admin-token", data.token);
      navigate("/admin");
    } catch (e) {
      setErr(e.message || "Login failed");
    }
  };

  return (
    // Background: Clashing bright colors (neon pink/yellow), rotated/scaled
    <div className="h-screen flex items-center justify-center bg-pink-500 transform scale-105 rotate-2">
      <form onSubmit={submit} className="bg-yellow-300 p-12 rounded-none shadow-2xl w-full max-w-lg border-8 border-purple-700">
        
        {/* Heading: Huge font, weird color, contrasting shadow. */}
        <h2 className="text-4xl font-extrabold text-red-700 mb-6 text-shadow-lg [text-shadow:5px_5px_0px_#00ffff]">
          💀 ADMIN ACCESS 🚨
        </h2>

        {/* Input 1: Wildly different background, rounded/sharp clash, distracting text color. */}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ENTER USERNAME HERE"
          className="w-full p-4 rounded-3xl mb-4 bg-teal-400 text-purple-900 border-4 border-dashed border-red-500 placeholder-purple-900 font-mono text-lg"
        />

        {/* Input 2: Different background/shape/font from Input 1. */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="PASSWORD?"
          className="w-full p-4 rounded-sm mb-6 bg-red-400 text-black border-4 border-double border-green-500 placeholder-black font-serif text-xl"
        />
        
        {/* CAPTCHA Display (For reCAPTCHA v3, this is usually just the badge) */}
        <div className="text-sm text-center text-red-700 font-bold mb-4">
            🤖 Bot Check Active (reCAPTCHA v3 style) 🤖
        </div>

        {/* Error Message: Bright, flashing-like appearance. */}
        {err && <div className="text-white bg-red-800 p-2 font-bold mb-4 animate-pulse">{err}</div>}

        {/* Button: Outlandish color, different shape, strange hover effect. */}
        <button
          type="submit"
          className="w-full bg-lime-400 text-black p-5 text-2xl uppercase font-black tracking-widest rounded-full shadow-inner hover:bg-black hover:text-lime-400 transition duration-300 transform hover:scale-105"
        >
          💥 ENGAGE LOGIN 💥
        </button>
      </form>
    </div>
  );
}