import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Trash2, QrCode, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LinkList({ links, dark, setLinks }) {
  const [qrOpen, setQrOpen] = useState(null);

  const copyText = (text) => navigator.clipboard.writeText(text);

  // DELETE FUNCTION
  const deleteLink = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this URL?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/url/${id}`, { method: "DELETE" });
      const data = await res.json();

      // Remove from frontend state
      setLinks((prev) => prev.filter((l) => l._id !== id));

      console.log("Deleted:", data);
    } catch (err) {
      console.error("Delete Error:", err);
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
    <div className="space-y-6 mt-6">
      {links.map((link, index) => {
        const shortUrl = `http://localhost:5000/${link.shortCode}`;

        return (
          <AnimatePresence key={link._id}>
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              whileHover={{ scale: 1.015 }}
              className={`relative p-5 rounded-2xl shadow-xl backdrop-blur-xl border
                ${dark ? "bg-neutral-900/50 border-neutral-700" : "bg-white/70 border-white/50"}`}
            >
              {/* Original URL */}
              <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-800"} opacity-80`}>
                {link.originalUrl}
              </p>

              {/* Short URL */}
              <div className="flex justify-between items-center mt-3">
                <a
                  href={shortUrl}
                  target="_blank"
                  className="font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-2"
                >
                  {shortUrl}
                  <ExternalLink size={16} />
                </a>

                <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
                  Clicks: {link.clicks}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-5">
                {/* Copy */}
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => copyText(shortUrl)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                >
                  <Copy size={18} /> Copy
                </motion.button>

                {/* QR */}
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setQrOpen(qrOpen === link._id ? null : link._id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
                >
                  <QrCode size={18} /> QR
                </motion.button>

                {/* Delete */}
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => deleteLink(link._id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-lg"
                >
                  <Trash2 size={18} /> Delete
                </motion.button>
              </div>

              {/* QR Popup */}
              <AnimatePresence>
                {qrOpen === link._id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.3 }}
                    className="mt-5 flex justify-center"
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
          </AnimatePresence>
        );
      })}
    </div>
  );
}
