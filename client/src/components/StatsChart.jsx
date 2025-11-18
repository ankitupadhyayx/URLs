import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart, // Using AreaChart for a more visually appealing fill
  Area,
} from "recharts";
import { motion } from "framer-motion"; // Import motion for chart container animation

export default function StatsChart({ links, dark }) {
  // 1. Data Preparation: Ensure data is sorted by date for accurate charting
  const sortedData = links
    .map((item) => ({
      // Use the Date object for proper sorting
      date: new Date(item.createdAt),
      createdAt: new Date(item.createdAt).toLocaleDateString(),
      clicks: item.clicks,
    }))
    .sort((a, b) => a.date - b.date); // Sort data by date ascending

  // If data is empty or only one point, the chart won't look good.
  const chartData = sortedData.length > 0 ? sortedData : [];

  // Define colors based on the theme
  const primaryColor = dark ? "#a78bfa" : "#3b82f6"; // Light Purple/Blue for line
  const gridStroke = dark ? "#374151" : "#e5e7eb"; // Darker grey for grid in dark mode
  const axisColor = dark ? "#d1d5db" : "#4b5563"; // Light grey for axis text

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} // Entrance animation for the chart
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      // Enhanced styling, responsive padding, and shadow
      className={`rounded-2xl p-4 sm:p-6 mt-10 shadow-2xl backdrop-blur-md border transition-all duration-500 w-full
        ${dark ? "bg-neutral-800/80 border-neutral-700" : "bg-white/90 border-gray-200"}`}
    >
      <h2 className={`text-xl sm:text-2xl font-semibold mb-4 ${dark ? "text-white" : "text-gray-800"}`}>
        📈 Click Analytics Over Time
      </h2>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
          <p className="text-lg">No click data available yet to generate a chart.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {/* Switched to AreaChart for a more modern visual */}
          <AreaChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis 
              dataKey="createdAt" 
              stroke={axisColor} 
              tick={{ fill: axisColor, fontSize: 12 }} 
              padding={{ left: 10, right: 10 }}
            />
            {/* Added Domain property to YAxis to start from 0 */}
            <YAxis 
              stroke={axisColor} 
              tick={{ fill: axisColor, fontSize: 12 }} 
              domain={[0, 'auto']} 
              allowDecimals={false} // Clicks must be integers
            />
            <Tooltip
              contentStyle={{
                backgroundColor: dark ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)",
                borderRadius: "10px",
                border: "1px solid " + gridStroke,
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                transition: "all 0.3s"
              }}
              labelStyle={{ fontWeight: 'bold', color: primaryColor }}
            />
            
            {/* Area component for smooth fill effect */}
            <Area
              type="monotone"
              dataKey="clicks"
              stroke={primaryColor}
              strokeWidth={3}
              fillOpacity={0.5}
              fill="url(#colorUv)" // Reference the gradient ID
              activeDot={{ r: 8, fill: primaryColor, strokeWidth: 2, stroke: dark ? '#222' : '#fff' }}
              dot={{ r: 4, fill: primaryColor }}
            />
            
            {/* Define gradient for the area fill */}
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Optional: Add a Line component if you prefer no area fill, or keep both */}
            {/* <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke={primaryColor} 
                strokeWidth={3} 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }} 
            /> */}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}