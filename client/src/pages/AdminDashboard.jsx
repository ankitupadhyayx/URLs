import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { Trash2, ExternalLink, RefreshCw, LogOut, Copy, ArrowUp, ArrowDown } from "lucide-react";
import StatsChart from "../components/StatsChart";
import toast, { Toaster } from "react-hot-toast"; // 🌟 ENHANCEMENT 1: Toast Notifications

// Utility function for copy (requires a hook like use-clipboard-copy or manual implementation)
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  toast.success("URL copied!");
};

export default function AdminDashboard({
  backendUrl = "https://urls-backend-cm9v.onrender.com",
  logout,
}) {
  const API_BASE = backendUrl;

  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 🌟 ENHANCEMENT 2: Sorting State
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });

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
        toast.error("Session expired. Please login again."); // Use toast
        logout(); // auto logout
        return;
      }

      const data = await res.json();
      setLinks(data);
      toast.success("Links loaded successfully.");
    } catch (err) {
      console.error("Error loading:", err);
      toast.error("Error loading links. Check console."); // Use toast
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Delete a URL
  // -------------------------
  const deleteLink = async (id) => {
    if (!window.confirm("Are you sure you want to delete this URL?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/url/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });

      if (!res.ok) {
        toast.error("Unauthorized / Session expired."); // Use toast
        logout();
        return;
      }

      setLinks((prev) => prev.filter((l) => l._id !== id));
      toast.success("Link deleted successfully."); // Use toast
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete."); // Use toast
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  // -------------------------
  // 🌟 ENHANCEMENT 3: Sorting Logic
  // -------------------------
  const sortedLinks = useMemo(() => {
    let sortableLinks = [...links];
    if (sortConfig.key) {
      sortableLinks.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableLinks;
  }, [links, sortConfig]);

  // -------------------------
  // 🌟 ENHANCEMENT 4: Filtered and Memoized Links
  // -------------------------
  const filteredLinks = useMemo(() => {
    return sortedLinks.filter(
      (l) =>
        l.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
        l.shortCode.toLowerCase().includes(search.toLowerCase())
    );
  }, [sortedLinks, search]);
  
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  return (
    // 🎨 ENHANCEMENT 5: New High-Contrast Dark UI
    <div className="min-h-screen p-4 md:p-8 lg:p-10 bg-gray-900 text-white font-sans">
      <Toaster position="top-right" /> {/* Toast Container */}
      
      {/* ---------------- Header ---------------- */}
      <div className="flex justify-between items-center mb-10 border-b border-purple-600 pb-4">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500 tracking-wider">
          URL Admin Console
        </h1>

        <div className="flex items-center gap-4">
          
          {/* Reload */}
          <motion.button
            onClick={loadLinks}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-full transition-all duration-300 ${loading ? "animate-spin-slow" : ""} bg-gray-800 text-teal-400 border border-teal-400 hover:bg-teal-400 hover:text-gray-900`}
          >
            <RefreshCw size={20} />
          </motion.button>

          {/* Logout */}
          <motion.button
            onClick={logout}
            whileTap={{ scale: 0.9 }}
            className="px-5 py-2.5 flex items-center gap-2 rounded-lg bg-red-600 text-white font-semibold shadow-lg hover:bg-red-700 transition duration-200"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </div>
      </div>

      {/* ---------------- Search ---------------- */}
      <motion.input
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Original URL or Short Code..."
        className="w-full max-w-2xl p-4 rounded-xl border border-sky-500 shadow-xl outline-none mb-10 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-sky-400"
      />

      {/* ---------------- Chart ---------------- */}
      {/* Assuming StatsChart handles dark mode internally */}
      <StatsChart links={links} dark={true} /> 

      {/* ---------------- Links Table ---------------- */}
      <h2 className="text-3xl font-bold mt-12 mb-6 text-sky-400">
        All Tracked Links ({filteredLinks.length})
      </h2>

      <div
        className="rounded-xl shadow-2xl overflow-x-auto bg-gray-800 border border-gray-700"
      >
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr className="bg-purple-600 sticky top-0 text-lg">
              {/* 🌟 ENHANCEMENT: Clickable headers for sorting */}
              <HeaderCell onClick={() => requestSort('originalUrl')} sortKey="originalUrl" currentSort={sortConfig}>Original URL</HeaderCell>
              <HeaderCell onClick={() => requestSort('shortCode')} sortKey="shortCode" currentSort={sortConfig}>Short URL</HeaderCell>
              <HeaderCell onClick={() => requestSort('clicks')} sortKey="clicks" currentSort={sortConfig} className="text-center">Clicks</HeaderCell>
              <th className="p-4 w-[100px]">QR</th>
              <th className="p-4 w-[100px]">Delete</th>
            </tr>
          </thead>

          <AnimatePresence initial={false}>
            <tbody className="divide-y divide-gray-700/50">
              {loading && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-xl text-sky-500">
                    <RefreshCw size={30} className="inline animate-spin mr-3" /> Loading data...
                  </td>
                </tr>
              )}
              {!loading && filteredLinks.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-xl text-gray-500">
                    No links found matching "{search}"
                  </td>
                </tr>
              )}
              
              {!loading && filteredLinks.map((link, index) => {
                const shortUrl = `${API_BASE}/${link.shortCode}`;

                return (
                  <motion.tr
                    key={link._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.02,
                    }}
                    className="transition hover:bg-gray-700/50"
                  >
                    <td className="p-4 break-all text-gray-300 max-w-xs">{link.originalUrl}</td>

                    <td className="p-4 break-all">
                      <div className="flex items-center gap-2">
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-mono text-sm"
                        >
                          {link.shortCode}
                          <ExternalLink size={14} />
                        </a>
                        {/* 🌟 ENHANCEMENT: Copy Button */}
                        <motion.button
                           onClick={() => copyToClipboard(shortUrl)}
                           whileTap={{ scale: 0.8 }}
                           className="text-gray-400 hover:text-white transition duration-150"
                        >
                          <Copy size={16} />
                        </motion.button>
                      </div>
                    </td>

                    <td className="p-4 text-center font-bold text-lg text-sky-300">
                      {link.clicks}
                    </td>

                    <td className="p-4 flex justify-center">
                      <QRCodeCanvas
                        size={60}
                        value={shortUrl}
                        bgColor="#1f2937" // Gray-800 background
                        fgColor="#ffffff"
                      />
                    </td>

                    <td className="p-4 text-center">
                      <motion.button
                        onClick={() => deleteLink(link._id)}
                        whileTap={{ scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="p-3 rounded-full bg-red-600 hover:bg-red-700 shadow-lg text-white transition-all"
                      >
                        <Trash2 size={18} />
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

// 🌟 Helper component for sortable table headers
const HeaderCell = ({ children, onClick, sortKey, currentSort, className = "" }) => (
    <th 
        className={`p-4 text-left cursor-pointer hover:bg-purple-700 transition duration-150 ${className}`}
        onClick={onClick}
    >
        <div className="flex items-center gap-2 font-bold">
            {children}
            {currentSort.key === sortKey && 
                (currentSort.direction === 'ascending' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)
            }
        </div>
    </th>
);