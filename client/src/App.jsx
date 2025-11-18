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
  const [links, setLinks] = useState([]);
  const [theme, setTheme] = useLocalStorage("theme", "dark");

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // ----------------------------------
  // ✅ STORE UNIQUE USER ID LOCALLY
  // ----------------------------------
  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = nanoid();
      localStorage.setItem("userId", id);
    }
  }, []);

  // ----------------------------------
  // ✅ LOAD USER-SPECIFIC LINKS
  // ----------------------------------
  const loadLinks = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await fetch(
        `https://urls-backend-cm9v.onrender.com/api/url/list/${userId}`
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

  // HOME PAGE UI
  const HomePage = () => (
    <div className="min-h-screen w-full transition relative overflow-hidden" data-theme={theme}>
      
      {/* Background Image */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <img
          src="/forest.jpg"
          alt="background"
          className="w-full h-full object-cover min-h-screen"
        />
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isDark ? "bg-black/80" : "bg-black/50"
          }`}
        ></div>
      </div>

      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.15, rotate: isDark ? 10 : -10 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-4 right-4 md:top-8 md:right-8 p-3 md:p-4 rounded-full shadow-2xl
                   bg-white dark:bg-neutral-900 border dark:border-neutral-700 z-50"
      >
        {isDark ? (
          <Sun className="text-yellow-400 w-6 h-6" />
        ) : (
          <Moon className="text-purple-600 w-6 h-6" />
        )}
      </motion.button>

      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-4 md:px-10 py-6 relative z-20">
        <h1
          className={`text-2xl md:text-3xl font-extrabold bg-gradient-to-r ${
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

      <div className="p-4 md:p-8 lg:p-10 w-full relative z-20">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto mt-4 md:mt-8 px-2"
        >
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold ${
              isDark
                ? "text-white"
                : "text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700"
            }`}
          >
            Shorten URLs Like a Pro
          </h1>
          <p className={`mt-4 text-md md:text-lg ${isDark ? "text-gray-300" : "text-gray-200"}`}>
            Create beautiful, trackable, shareable short URLs.
          </p>
        </motion.div>

        {/* Central Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className={`max-w-4xl mx-auto mt-8 md:mt-12 mb-16 p-5 sm:p-8 md:p-10 rounded-3xl shadow-2xl ${
            isDark ? "bg-neutral-900/80 border-neutral-700" : "bg-white/80 border-white/60"
          } backdrop-blur-xl border`}
        >
          <ShortenForm
            onCreated={(newUrl) => setLinks([newUrl, ...links])}
            backendUrl="https://urls-backend-cm9v.onrender.com"
          />

          <div className="mt-10 mb-6 w-full border-t border-gray-300/40"></div>

          <h2 className={`text-2xl md:text-3xl font-semibold ${isDark ? "text-white" : "text-black"}`}>
            Your Shortened Links
          </h2>

          <LinkList
            links={links}
            setLinks={setLinks}
            dark={isDark}
            backendUrl="https://urls-backend-cm9v.onrender.com"
          />

          <StatsChart links={links} dark={isDark} />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-neutral-900/90 text-white border-t border-neutral-700/50 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 order-2 md:order-1 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} URL Shortener. All rights reserved.
          </p>

          <div className="flex items-center space-x-2 order-1 md:order-2">
            <span className="text-sm text-gray-400">Crafted by:</span>
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
        </div>
      </footer>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/admin"
        element={
          <AdminDashboard
            dark={isDark}
            backendUrl="https://urls-backend-cm9v.onrender.com"
          />
        }
      />
    </Routes>
  );
}
