import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { Trash2, ExternalLink } from "lucide-react";
import StatsChart from "../components/StatsChart";

export default function AdminDashboard({ dark }) {
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState("");

  const loadLinks = async () => {
    const res = await fetch("/api/url/list/all");
    const data = await res.json();
    setLinks(data);
  };

  const deleteLink = async (id) => {
    const c = confirm("Delete this URL?");
    if (!c) return;

    await fetch(`/api/url/${id}`, { method: "DELETE" });
    setLinks((prev) => prev.filter((l) => l._id !== id));
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const filteredLinks = links.filter((l) =>
    l.originalUrl.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`p-10 min-h-screen ${dark ? "text-white" : "text-black"}`}>
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-lg p-3 rounded-xl border dark:bg-neutral-900 dark:border-neutral-700 mb-6"
        placeholder="Search URLs..."
      />

      {/* Stats Chart */}
      <StatsChart links={links} dark={dark} />

      {/* Table */}
      <div
        className={`mt-10 rounded-xl overflow-hidden shadow-xl 
        ${dark ? "bg-neutral-900 border-neutral-700" : "bg-white border"} 
        border`}
      >
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3">Original URL</th>
              <th className="p-3">Short URL</th>
              <th className="p-3">Clicks</th>
              <th className="p-3">QR</th>
              <th className="p-3">Delete</th>
            </tr>
          </thead>

          <tbody>
            {filteredLinks.map((link, index) => {
              const shortUrl = `http://localhost:5000/${link.shortCode}`;

              return (
                <motion.tr
                  key={link._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b dark:border-neutral-700"
                >
                  <td className="p-3">{link.originalUrl}</td>

                  <td className="p-3">
                    <a
                      href={shortUrl}
                      target="_blank"
                      className="text-blue-500 underline flex items-center gap-1"
                    >
                      {shortUrl} <ExternalLink size={14} />
                    </a>
                  </td>

                  <td className="p-3">{link.clicks}</td>

                  <td className="p-3">
                    <QRCodeCanvas size={50} value={shortUrl} />
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => deleteLink(link._id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
