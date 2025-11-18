import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import ShortenForm from "./components/ShortenForm";
import LinkList from "./components/LinkList";
import StatsChart from "./components/StatsChart";
import AdminDashboard from "./pages/AdminDashboard";

import { nanoid } from "nanoid";
import { motion } from "framer-motion";
import useLocalStorage from "use-local-storage";
import { Sun, Moon, Instagram } from "lucide-react";

export default function App() {
  const BACKEND_URL = "https://urls-backend-cm9v.onrender.com";

  const [links, setLinks] = useState([]);
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // ----------------------------------
  // 🟦 CREATE LOCAL USER ID
  // ----------------------------------
  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = nanoid();
      localStorage.setItem("userId", id);
    }
  }, []);

  // ----------------------------------
  // 🟦 LOAD USER-SPECIFIC LINKS
  // ----------------------------------
  const loadLinks = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await fetch(
        `${BACKEND_URL}/api/url/list/user/${userId}`
      );

      const data = await res.json();
      setLinks(data);
    } catch (error) {
      console.error("Failed to load links:", error);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  // ----------------------------------
  // 🟦 HOME PAGE UI
  // ----------------------------------
  const HomePage = () => (
    <div
      className="min-h-screen w-full transition relative overflow-hidden"
      data-theme={theme}
    >
      {/* Background */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <img
          src="/forest.jpg"
          alt="background"
          className="w-full h-full object-cover min-h-screen"
        />
        <div
          className={`absolute inset-0 ${
            isDark ? "bg-black/80" : "bg-black/50"
          }`}
        ></div>
      </div>

      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-4 right-4 p-3 rounded-full bg-white dark:bg-neutral-900
                   border dark:border-neutral-700 shadow-2xl z-50"
      >
        {isDark ? (
          <Sun className="text-yellow-400 w-6 h-6" />
        ) : (
          <Moon className="text-purple-600 w-6 h-6" />
        )}
      </motion.button>

      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-6 py-6 relative z-20">
        <h1
          className={`text-3xl font-extrabold bg-gradient-to-r ${
            isDark ? "from-purple-300 to-blue-300" : "from-blue-700 to-purple-700"
          } bg-clip-text text-transparent`}
        >
          URL Shortener
        </h1>

        <Link
          to="/admin"
          className="px-4 py-2 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700"
        >
          Admin Panel
        </Link>
      </nav>

      {/* Main Section */}
      <div className="p-6 md:p-10 w-full relative z-20">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1
            className={`text-5xl font-extrabold ${
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

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`max-w-4xl mx-auto mt-10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl border
            ${isDark ? "bg-neutral-900/80 border-neutral-700" : "bg-white/80 border-white/60"}`}
        >
          <ShortenForm
            onCreated={(newUrl) => setLinks([newUrl, ...links])}
            backendUrl={BACKEND_URL}
          />

          <div className="mt-8 mb-4 border-t border-gray-400/40"></div>

          <h2
            className={`text-3xl font-semibold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Your Shortened Links
          </h2>

          <LinkList
            links={links}
            setLinks={setLinks}
            dark={isDark}
            backendUrl={BACKEND_URL}
          />

          <StatsChart links={links} dark={isDark} />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-neutral-900/90 text-white border-t border-neutral-700/50 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} URL Shortener.</p>

          <a
            href="https://www.instagram.com/ankitupadhyayx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
          >
            <Instagram size={18} />
            ankitupadhyayx
          </a>
        </div>
      </footer>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/admin"
        element={<AdminDashboard dark={isDark} backendUrl={BACKEND_URL} />}
      />
    </Routes>
  );
}
