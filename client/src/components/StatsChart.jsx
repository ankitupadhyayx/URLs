import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function StatsChart({ links, dark }) {
  const data = links.map((item) => ({
    createdAt: new Date(item.createdAt).toLocaleDateString(),
    clicks: item.clicks,
  }));

  return (
    <div
      className={`rounded-2xl p-6 mt-10 shadow-xl backdrop-blur-xl border 
        ${dark ? "bg-neutral-900/60 border-neutral-700" : "bg-white/70 border-white/40"}`}
    >
      <h2 className={`text-2xl font-semibold mb-4 ${dark ? "text-white" : "text-black"}`}>
        Click Analytics
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#444" : "#ddd"} />
          <XAxis dataKey="createdAt" stroke={dark ? "#ccc" : "#333"} />
          <YAxis stroke={dark ? "#ccc" : "#333"} />
          <Tooltip
            contentStyle={{
              backgroundColor: dark ? "#1e1e1e" : "#fff",
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke={dark ? "#8b5cf6" : "#3b82f6"}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
