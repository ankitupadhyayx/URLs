import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Trash2, QrCode, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LinkList({ links, dark, setLinks }) {
  const [qrOpen, setQrOpen] = useState(null);
  const [copiedId, setCopiedId] = useState(null); // State for copy feedback

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500); // Reset after 1.5 seconds
  };

  // DELETE FUNCTION
  const deleteLink = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this URL?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/url/${id}`, { method: "DELETE" }); // Use full URL here
      if (!res.ok) throw new Error('Delete failed on server.');
      
      setLinks((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete URL. Check your server connection.");
    }
  };

  if (!links.length) {
    return (
      <p className={`text-center mt-5 text-lg ${dark ? "text-gray-300" : "text-gray-700"}`}>
        No URLs generated yet.
      </p>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <AnimatePresence>
        {links.map((link, index) => {
          const shortUrl = `http://localhost:5000/${link.shortCode}`;
          const isCopied = copiedId === link._id;

          return (
            <motion.div
              key={link._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, padding: 0 }} // Smooth exit animation
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.01, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.15)" }} // Enhanced hover effect
              className={`relative p-5 rounded-2xl shadow-xl backdrop-blur-md border transition-all duration-300
                ${dark ? "bg-neutral-900/60 border-neutral-700" : "bg-white/80 border-white/50"}`}
            >
              {/* Original URL */}
              <p className={`text-sm break-words ${dark ? "text-gray-300" : "text-gray-800"} opacity-80`}>
                {link.originalUrl}
              </p>

              {/* Short URL & Clicks */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 gap-2">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-400 hover:text-blue-300 flex items-center gap-2 text-lg break-all transition-colors duration-300"
                >
                  {shortUrl}
                  <ExternalLink size={16} />
                </a>

                <span className={`text-sm font-medium ${dark ? "text-gray-400" : "text-gray-600"} whitespace-nowrap`}>
                  Clicks: {link.clicks}
                </span>
              </div>

              {/* Buttons - Adjusted for better mobile layout (wrap) */}
              <div className="flex flex-wrap gap-3 mt-5">
                {/* Copy */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => copyText(shortUrl, link._id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white shadow-lg transition-all duration-300 
                              ${isCopied ? "bg-green-500 hover:bg-green-600" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  <Copy size={18} /> {isCopied ? 'Copied!' : 'Copy'}
                </motion.button>

                {/* QR */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setQrOpen(qrOpen === link._id ? null : link._id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-lg transition-all duration-300"
                >
                  <QrCode size={18} /> QR
                </motion.button>

                {/* Delete */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => deleteLink(link._id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-lg transition-all duration-300"
                >
                  <Trash2 size={18} /> Delete
                </motion.button>
              </div>

              {/* QR Popup */}
              <AnimatePresence>
                {qrOpen === link._id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, height: 0 }}
                    animate={{ opacity: 1, scale: 1, height: "auto" }}
                    exit={{ opacity: 0, scale: 0.8, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-5 flex justify-center overflow-hidden" // Added overflow-hidden for smooth height transition
                  >
                    <div
                      className={`p-4 rounded-2xl shadow-xl border
                        ${dark ? "bg-neutral-800/70 border-neutral-600" : "bg-white/90 border-gray-200"}`}
                    >
                      <QRCodeCanvas value={shortUrl} size={160} includeMargin={true} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}