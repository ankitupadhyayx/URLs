import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ShortenForm from "./components/ShortenForm";
import LinkList from "./components/LinkList";
import StatsChart from "./components/StatsChart";
import AdminDashboard from "./pages/AdminDashboard";

import { motion } from "framer-motion";
import useLocalStorage from "use-local-storage";
import { Sun, Moon } from "lucide-react";

export default function App() {
  const [links, setLinks] = useState([]);
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const loadLinks = async () => {
    const res = await fetch("http://localhost:5000/api/url/list/all");
    const data = await res.json();
    setLinks(data);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  // ================================
  // HOME PAGE UI (Moved into function)
  // ================================
  const HomePage = () => (
    <div className="min-h-screen w-full transition relative overflow-hidden">

      {/* Background video */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="/forest.mp4"
        />
        <div
          className={`absolute inset-0 ${
            isDark ? "bg-black/60" : "bg-black/30"
          }`}
        ></div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 p-3 rounded-full shadow-xl bg-white dark:bg-neutral-900 border 
          hover:scale-110 transition z-50"
      >
        {isDark ? (
          <Sun className="text-yellow-300" />
        ) : (
          <Moon className="text-purple-600" />
        )}
      </button>

      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-10 py-6 relative z-20">
        <h1
          className={`text-3xl font-extrabold bg-gradient-to-r 
            ${
              isDark
                ? "from-purple-300 to-blue-300"
                : "from-blue-700 to-purple-700"
            } 
            bg-clip-text text-transparent`}
        >
          URL Shortener
        </h1>

        {/* Admin Button */}
        <Link
          to="/admin"
          className="px-5 py-2 rounded-xl bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition"
        >
          Admin Panel
        </Link>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mt-8 relative z-20 px-6"
      >
        <h1
          className={`text-6xl font-extrabold leading-tight 
            ${
              isDark
                ? "text-white"
                : "text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700"
            }`}
        >
          Shorten URLs Like a Pro
        </h1>
        <p className={`mt-4 text-lg ${isDark ? "text-gray-300" : "text-gray-200"}`}>
          Create beautiful, trackable, shareable short URLs.
        </p>
      </motion.div>

      {/* Main Form + List + Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`max-w-4xl mx-auto mt-12 mb-16 p-10 rounded-3xl shadow-2xl 
          ${
            isDark
              ? "bg-neutral-900/70 border-neutral-700"
              : "bg-white/70 border-white/40"
          } 
          backdrop-blur-xl border relative z-20`}
      >
        <ShortenForm onCreated={(newUrl) => setLinks([newUrl, ...links])} />

        <div className="mt-10 mb-6 w-full border-t border-gray-300/40"></div>

        <h2 className={`text-3xl font-semibold ${isDark ? "text-white" : "text-black"}`}>
          Your Shortened Links
        </h2>

        <LinkList links={links} setLinks={setLinks} dark={isDark} />

        <StatsChart links={links} dark={isDark} />
      </motion.div>

      {/* Footer */}
      <footer className="text-center py-10 text-sm text-white relative z-20">
        © {new Date().getFullYear()} URL Shortner Pro — Crafted by Ankit
      </footer>
    </div>
  );

  // ================================
  // ROUTES
  // ================================
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminDashboard dark={isDark} />} />
    </Routes>
  );
}
