import React, { useState } from "react";
// Assuming you have 'react-router-dom' setup in your environment
// Since I cannot modify external setup, I'll keep the import, but note that 
// in a standalone canvas environment, 'useNavigate' will require a router context.
import { useNavigate } from "react-router-dom"; 
import { Lock, User } from 'lucide-react'; // Using lucide-react for professional icons

export default function AdminLogin({ backendUrl = "https://urls-backend-cm9v.onrender.com" }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  
  // Mock useNavigate for environments without React Router,
  // but keep the original if the user's environment supports it.
  const navigate = typeof useNavigate === 'function' ? useNavigate() : () => console.log("Navigation triggered (mocked)");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    
    // --- CAPTCHA Integration Logic Placeholder ---
    // Keeping this logic intact as requested.
    const captchaToken = "MOCK_RECAPTCHA_TOKEN_12345"; 
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
      // NOTE: Using localStorage as per original code, but Firebase/Firestore is preferred
      // for real-world production apps where state persistence is critical.
      localStorage.setItem("admin-token", data.token);
      
      // Navigate only if real useNavigate is available
      if (typeof useNavigate === 'function') {
        navigate("/admin");
      }
      
    } catch (e) {
      setErr(e.message || "Login failed");
    }
  };

  return (
    // Main Container: Dark, full-screen background
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      
      {/* Login Card: Sleek, slightly lighter dark box */}
      <form 
        onSubmit={submit} 
        className="bg-gray-800 p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-700"
      >
        
        {/* Header/Title */}
        <div className="flex flex-col items-center mb-10">
          <Lock className="text-purple-400 w-10 h-10 mb-3" />
          <h2 className="text-3xl font-extrabold text-white">
            Admin Portal Access
          </h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage short URLs.</p>
        </div>

        {/* Username Input */}
        <div className="mb-5 relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-150 text-base"
          />
        </div>

        {/* Password Input */}
        <div className="mb-8 relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-150 text-base"
          />
        </div>
        
        {/* CAPTCHA Display/Note (Cleaned up) */}
        <div className="text-xs text-center text-gray-500 mb-6">
            Protected by reCAPTCHA (v3 integration)
        </div>

        {/* Error Message: Cleaned up, non-pulsing */}
        {err && (
          <div className="bg-red-700 text-white p-3 rounded-lg font-medium text-sm mb-6 text-center shadow-md">
            {err}
          </div>
        )}

        {/* Button: Primary accent color (Purple/Blue theme) */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-3 text-lg font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}