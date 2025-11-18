import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { Trash2, ExternalLink, RefreshCw, LogOut } from "lucide-react";
import StatsChart from "../components/StatsChart";

export default function AdminDashboard({
  dark,
  backendUrl = "https://urls-backend-cm9v.onrender.com",
  logout,
}) {
  const API_BASE = backendUrl;

  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // -------------------------
  // Load all links
  // -------------------------
  const loadLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/url/list/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });

      if (!res.ok) {
        alert("Session expired. Please login again.");
        logout(); // auto logout
        return;
      }

      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error("Error loading:", err);
      alert("Error loading links.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Delete a URL
  // -------------------------
  const deleteLink = async (id) => {
    const c = window.confirm("Delete this URL?");
    if (!c) return;

    try {
      const res = await fetch(`${API_BASE}/api/url/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });

      if (!res.ok) {
        alert("Unauthorized / session expired.");
        logout();
        return;
      }

      setLinks((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete");
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  // Search filter
  const filteredLinks = links.filter(
    (l) =>
      l.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
      l.shortCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen p-4 md:p-8 lg:p-10 transition-colors ${
        dark ? "bg-neutral-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      {/* ---------------- Header ---------------- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Admin Dashboard
        </h1>

        <div className="flex items-center gap-3">

          {/* Reload */}
          <motion.button
            onClick={loadLinks}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full ${loading ? "animate-spin" : ""} ${
              dark
                ? "bg-neutral-800 text-blue-400"
                : "bg-white text-blue-600 shadow-md"
            }`}
          >
            <RefreshCw size={20} />
          </motion.button>

          {/* Logout */}
          <motion.button
            onClick={logout}
            whileTap={{ scale: 0.9 }}
            className="px-4 py-2 flex items-center gap-2 rounded-xl bg-red-600 text-white shadow-lg hover:bg-red-700"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </div>
      </div>

      {/* ---------------- Search ---------------- */}
      <motion.input
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Original or Short URLs..."
        className={`w-full max-w-xl p-3 rounded-xl border shadow-inner outline-none mb-8 ${
          dark
            ? "bg-neutral-800 border-neutral-700 text-white"
            : "bg-white border-gray-300 text-black"
        }`}
      />

      {/* ---------------- Chart ---------------- */}
      <StatsChart links={links} dark={dark} />

      {/* ---------------- Links Table ---------------- */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">
        All Tracked Links ({filteredLinks.length})
      </h2>

      <div
        className={`rounded-xl shadow-xl overflow-x-auto ${
          dark ? "bg-neutral-800 border-neutral-700" : "bg-white border"
        }`}
      >
        <table className="min-w-full divide-y divide-gray-700/50">
          <thead>
            <tr className="bg-blue-600/90 text-white sticky top-0">
              <th className="p-3 text-left w-2/5">Original URL</th>
              <th className="p-3 text-left w-1/5">Short URL</th>
              <th className="p-3 w-1/12">Clicks</th>
              <th className="p-3 w-1/12">QR</th>
              <th className="p-3 w-1/12">Delete</th>
            </tr>
          </thead>

          <AnimatePresence initial={false}>
            <tbody className="divide-y divide-gray-700/40">
              {filteredLinks.map((link, index) => {
                const shortUrl = `${API_BASE}/${link.shortCode}`;

                return (
                  <motion.tr
                    key={link._id}
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.03,
                    }}
                    className="transition hover:bg-neutral-700/20"
                  >
                    <td className="p-3 break-all text-gray-300">
                      {link.originalUrl}
                    </td>

                    <td className="p-3 break-all">
                      <a
                        href={shortUrl}
                        target="_blank"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        {shortUrl}
                        <ExternalLink size={14} />
                      </a>
                    </td>

                    <td className="p-3 text-center font-semibold">
                      {link.clicks}
                    </td>

                    <td className="p-3 flex justify-center">
                      <QRCodeCanvas
                        size={50}
                        value={shortUrl}
                        bgColor={dark ? "#2a2a2a" : "#fff"}
                        fgColor={dark ? "#fff" : "#000"}
                      />
                    </td>

                    <td className="p-3 text-center">
                      <motion.button
                        onClick={() => deleteLink(link._id)}
                        whileTap={{ scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="p-2 rounded-full bg-red-600 hover:bg-red-700 shadow text-white"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </AnimatePresence>
        </table>
      </div>
    </div>
  );
}
