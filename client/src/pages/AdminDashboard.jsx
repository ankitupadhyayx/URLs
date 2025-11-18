import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { Trash2, ExternalLink, RefreshCw } from "lucide-react";
import StatsChart from "../components/StatsChart";

export default function AdminDashboard({ dark }) {
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // LIVE BACKEND URL
  const API_BASE = "https://urls-backend-cm9v.onrender.com";

  const loadLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/url/list/all`);
      if (!res.ok) throw new Error("Failed to fetch links");
      const data = await res.json();
      setLinks(data);
    } catch (error) {
      console.error("Error loading links:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLink = async (id) => {
    const c = window.confirm("Are you sure you want to delete this URL?");
    if (!c) return;

    try {
      await fetch(`${API_BASE}/api/url/${id}`, { method: "DELETE" });
      setLinks((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      console.error("Error deleting link:", error);
      alert("Failed to delete URL. Please check server status.");
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const filteredLinks = links.filter(
    (l) =>
      l.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
      l.shortCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`p-4 md:p-8 lg:p-10 min-h-screen transition-colors duration-500 ${
        dark ? "bg-neutral-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Admin Dashboard
        </h1>

        <motion.button
          onClick={loadLinks}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full transition-all duration-300 transform ${
            loading ? "animate-spin" : "hover:scale-110"
          } ${
            dark
              ? "bg-neutral-800 text-blue-400"
              : "bg-white text-blue-600 shadow-md"
          }`}
          title="Refresh Data"
        >
          <RefreshCw size={20} />
        </motion.button>
      </div>

      {/* Search Input */}
      <motion.input
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-xl p-3 rounded-xl border transition-all duration-300 
          dark:bg-neutral-800 dark:border-neutral-700 dark:text-white 
          bg-white border-gray-300 text-black 
          focus:ring-2 focus:ring-blue-500/50 outline-none mb-8 shadow-inner"
        placeholder="Search Original or Short URLs..."
      />

      {/* Stats Chart */}
      <StatsChart links={links} dark={dark} />

      {/* Links Table */}
      <h2
        className={`text-2xl font-semibold mt-10 mb-4 ${
          dark ? "text-white" : "text-black"
        }`}
      >
        All Tracked Links ({filteredLinks.length})
      </h2>

      <div
        className={`mt-4 rounded-xl shadow-2xl overflow-x-auto transition-colors duration-500 ${
          dark ? "bg-neutral-800 border-neutral-700" : "bg-white border border-gray-200"
        }`}
      >
        <table className="min-w-full divide-y divide-gray-700/50">
          <thead>
            <tr className="bg-blue-600/90 text-white sticky top-0">
              <th className="p-3 text-left w-2/5 min-w-[300px]">Original URL</th>
              <th className="p-3 text-left w-1/5 min-w-[200px]">Short URL</th>
              <th className="p-3 w-1/12 min-w-[80px]">Clicks</th>
              <th className="p-3 w-1/12 min-w-[60px]">QR</th>
              <th className="p-3 w-1/12 min-w-[60px]">Delete</th>
            </tr>
          </thead>

          <AnimatePresence initial={false}>
            <tbody className="divide-y dark:divide-neutral-700 divide-gray-200">
              {loading && links.length === 0 ? (
                <tr className="text-center">
                  <td colSpan="5" className="p-4 text-gray-500">
                    Loading links...
                  </td>
                </tr>
              ) : filteredLinks.length === 0 ? (
                <tr className="text-center">
                  <td colSpan="5" className="p-4 text-gray-500">
                    No links match your search.
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link, index) => {
                  const shortUrl = `${API_BASE}/${link.shortCode}`;

                  return (
                    <motion.tr
                      key={link._id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        x: 50,
                        transition: { duration: 0.3 },
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        delay: index * 0.03,
                      }}
                      whileHover={{ backgroundColor: dark ? "#2c2c2c" : "#f5f5f5" }}
                      className="transition-colors duration-200 text-sm"
                    >
                      {/* Original URL */}
                      <td className="p-3 break-all text-gray-400 max-w-[300px]">
                        {link.originalUrl}
                      </td>

                      {/* Short URL */}
                      <td className="p-3">
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium break-all transition-colors duration-200"
                        >
                          {shortUrl} <ExternalLink size={14} />
                        </a>
                      </td>

                      {/* Clicks */}
                      <td className="p-3 text-center font-semibold text-lg">
                        {link.clicks}
                      </td>

                      {/* QR */}
                      <td className="p-3 flex justify-center">
                        <QRCodeCanvas
                          size={50}
                          value={shortUrl}
                          fgColor={dark ? "#fff" : "#000"}
                          bgColor={dark ? "#3a3a3a" : "#fff"}
                        />
                      </td>

                      {/* Delete Button */}
                      <td className="p-3 text-center">
                        <motion.button
                          onClick={() => deleteLink(link._id)}
                          whileTap={{ scale: 0.8 }}
                          whileHover={{ scale: 1.1 }}
                          className="p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-200"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </AnimatePresence>
        </table>
      </div>
    </div>
  );
}
