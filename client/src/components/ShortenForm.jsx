import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ShortenForm({ onCreated }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);

    // Smooth delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const res = await fetch(
        "https://urls-backend-cm9v.onrender.com/api/url/shorten",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            originalUrl: url,
            userId: localStorage.getItem("userId"), // ✅ ADDED HERE
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to shorten URL");

      const data = await res.json();
      onCreated(data);
      setUrl("");
    } catch (error) {
      console.error("Shorten Error:", error);
      alert("Error shortening URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
      />

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        disabled={loading || !url.trim()}
        type="submit"
        className={`px-6 py-3 min-w-[120px] font-semibold rounded-xl text-lg shadow-xl 
                    transition-all duration-300 transform
          ${
            loading
              ? "bg-blue-400 cursor-progress"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 text-white"
          }`}
      >
        {loading ? "Shortening..." : "Shorten"}
      </motion.button>
    </motion.form>
  );
}
