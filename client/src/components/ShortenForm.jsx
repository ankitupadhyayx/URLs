import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * ShortenForm
 * - Sends { originalUrl, userId } to backend
 * - Uses Vite env var VITE_API_BASE if available, otherwise falls back to deployed URL
 * - Handles loading, errors and simple validation
 */
export default function ShortenForm({ onCreated }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Use Vite env var when building, otherwise fallback to current deployed backend
  const API_BASE =
    import.meta?.env?.VITE_API_BASE ||
    "https://urls-backend-cm9v.onrender.com";

  const submit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);

    // small UX delay
    await new Promise((r) => setTimeout(r, 250));

    try {
      // ensure userId exists (should be set on first app load)
      const userId = localStorage.getItem("userId");
      if (!userId) {
        // generate a fallback ID if something went wrong (very unlikely)
        // if you prefer, force user to reload / re-generate ID elsewhere
        console.warn("userId missing — generating temporary id");
        const tmp = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
        localStorage.setItem("userId", tmp);
      }

      const res = await fetch(`${API_BASE}/api/url/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: url.trim(),
          userId: localStorage.getItem("userId"),
        }),
      });

      if (!res.ok) {
        // try to read server error message
        let errorMsg = "Failed to shorten URL";
        try {
          const errJson = await res.json();
          if (errJson?.error) errorMsg = errJson.error;
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const data = await res.json();
      onCreated(data);
      setUrl("");
    } catch (error) {
      console.error("Shorten Error:", error);
      // friendly feedback
      alert(`Could not shorten URL: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      onSubmit={submit}
      className="flex flex-col sm:flex-row gap-4 sm:gap-3 bg-white/70 dark:bg-neutral-900/60 p-5 
                 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/40 dark:border-neutral-700 
                 hover:shadow-3xl transition duration-300"
    >
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste your long URL..."
        className="flex-1 w-full p-4 rounded-xl border dark:bg-neutral-800/80 dark:text-white 
                   bg-white/90 text-black focus:ring-4 focus:ring-blue-500/60 outline-none 
                   placeholder-gray-500 shadow-inner text-lg transition-all duration-300"
        aria-label="Long URL"
      />

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.18 }}
        disabled={loading || !url.trim()}
        type="submit"
        className={`px-6 py-3 min-w-[120px] font-semibold rounded-xl text-lg shadow-xl 
                    transition-all duration-300 transform
          ${
            loading
              ? "bg-blue-400 cursor-progress text-white"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 text-white"
          }`}
      >
        {loading ? "Shortening..." : "Shorten"}
      </motion.button>
    </motion.form>
  );
}
