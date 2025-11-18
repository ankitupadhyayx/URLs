import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ShortenForm from "./components/ShortenForm";
import LinkList from "./components/LinkList";
import StatsChart from "./components/StatsChart";
import AdminDashboard from "./pages/AdminDashboard";

import { motion } from "framer-motion";
import useLocalStorage from "use-local-storage";
import { Sun, Moon, Instagram } from "lucide-react"; // Import Instagram icon

export default function App() {
  const [links, setLinks] = useState([]);
  const [theme, setTheme] = useLocalStorage("theme", "dark"); // Defaulting to dark for the sleek look in the image

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const loadLinks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/url/list/all");
      const data = await res.json();
      setLinks(data);
    } catch (error) {
      console.error("Failed to load links:", error);
      // Optional: Add user feedback here
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  // ================================
  // HOME PAGE
  // ================================
  const HomePage = () => (
    // Added data-theme for easier CSS-based global theme styling if needed
    <div className="min-h-screen w-full transition relative overflow-hidden" data-theme={theme}>
      {/* Background Image - Adjusted for better mobile scaling */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        {/* Note: The image path is hardcoded as per original, ensure '/forest.jpg' exists or change it */}
        <img
          src="/forest.jpg" 
          alt="background"
          className="w-full h-full object-cover min-h-screen"
        />
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isDark ? "bg-black/80" : "bg-black/50" // Increased overlay darkness slightly
          }`}
        ></div>
      </div>

      {/* Theme Toggle Button - Fixed position for accessibility */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.15, rotate: isDark ? 10 : -10 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-4 right-4 md:top-8 md:right-8 p-3 md:p-4 rounded-full shadow-2xl transition-colors duration-500 z-50 
                   bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-4 
                   focus:ring-purple-500/50"
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
          className={`text-2xl md:text-3xl font-extrabold transition-colors duration-500 bg-gradient-to-r 
            ${
              isDark
                ? "from-purple-300 to-blue-300"
                : "from-blue-700 to-purple-700"
            } 
            bg-clip-text text-transparent`}
        >
          URL Shortener
        </h1>

        <Link
          to="/admin"
          className="px-4 py-2 text-sm md:text-base rounded-full bg-purple-600 text-white shadow-lg 
                     hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
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
            className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight transition-colors duration-500
              ${
                isDark
                  ? "text-white"
                  : "text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700"
              }`}
          >
            Shorten URLs Like a Pro
          </h1>
          <p className={`mt-4 text-md md:text-lg transition-colors duration-500 ${isDark ? "text-gray-300" : "text-gray-200"}`}>
            Create beautiful, trackable, shareable short URLs.
          </p>
        </motion.div>

        {/* Main Form + List */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className={`max-w-4xl mx-auto mt-8 md:mt-12 mb-16 p-5 sm:p-8 md:p-10 rounded-3xl shadow-2xl transition-all duration-500
            ${
              isDark
                ? "bg-neutral-900/80 border-neutral-700" // Slightly more opaque background
                : "bg-white/80 border-white/60"
            } 
            backdrop-blur-xl border relative z-20`}
        >
          <ShortenForm onCreated={(newUrl) => setLinks([newUrl, ...links])} />

          <div className="mt-10 mb-6 w-full border-t border-gray-300/40"></div>

          <h2 className={`text-2xl md:text-3xl font-semibold transition-colors duration-500 ${isDark ? "text-white" : "text-black"}`}>
            Your Shortened Links
          </h2>

          <LinkList links={links} setLinks={setLinks} dark={isDark} />

          {/* StatsChart visibility toggle for mobile? (Optional future feature) */}
          <StatsChart links={links} dark={isDark} />
        </motion.div>
      </div>

      {/* Footer - Professional Look */}
      <footer className="w-full bg-neutral-900/90 dark:bg-black/90 text-white border-t border-neutral-700/50 py-8 relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 order-2 md:order-1 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} URL Shortener. All rights reserved.
          </p>

          <div className="flex items-center space-x-4 order-1 md:order-2">
            <span className="text-sm text-gray-400">
              Crafted by:
            </span>
            <a
              href="https://www.instagram.com/ankitupadhyayx" // Assumed correct Instagram link structure
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-md text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Instagram size={18} className="text-pink-500" />
              ankitupadhyayx
            </a>
          </div>
        </div>
      </footer>
    </div>
  );

  // ================================
  // ROUTES
  // ================================
  // The scroll restoration is naturally handled by react-router-dom, but for specific smooth scroll effects, 
  // you might use an external library or CSS property `scroll-behavior: smooth;` on the root element.
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Passing theme to AdminDashboard */}
      <Route path="/admin" element={<AdminDashboard dark={isDark} />} />
    </Routes>
  );
}