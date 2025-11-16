import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ShortenForm({ onCreated }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/url/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalUrl: url }),
    });

    const data = await res.json();
    onCreated(data);

    setUrl("");
    setLoading(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={submit}
      className="flex gap-3 bg-white/60 dark:bg-neutral-900/50 p-5 rounded-2xl shadow-xl backdrop-blur-xl border border-white/40 dark:border-neutral-700 hover:shadow-2xl transition"
    >
      {/* INPUT */}
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste your long URL..."
        className="flex-1 p-3 rounded-xl border dark:bg-neutral-800/80 dark:text-white bg-white/80 text-black focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 shadow-inner"
      />

      {/* BUTTON */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        disabled={loading}
        className={`px-6 py-3 font-semibold rounded-xl shadow-lg text-white ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Shortening..." : "Shorten"}
      </motion.button>
    </motion.form>
  );
}
