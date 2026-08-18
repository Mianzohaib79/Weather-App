import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-xl text-xs space-y-1">
        <p className="font-bold text-white">{data.fullTime}</p>
        <p className="text-cyan-400 font-extrabold text-sm">{data.temp}°C</p>
        <p className="text-slate-400 capitalize">{data.description}</p>
      </div>
    );
  }
  return null;
};

const HourlyForecast = ({ data }) => {
  if (!data?.list || data.list.length === 0) return null;

  // Filter first 8 items (~24 hours in 3-hour steps)
  const hourlyData = data.list.slice(0, 8).map((item) => {
    const date = new Date(item.dt_txt || item.dt * 1000);
    const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const shortTime = date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    const iconCode = item.weather?.[0]?.icon || '01d';
    const mainCondition = item.weather?.[0]?.main || 'Clear';
    const description = item.weather?.[0]?.description || '';
    const temp = Math.round(item.main?.temp ?? 0);

    return {
      time: shortTime,
      fullTime: timeStr,
      temp,
      icon: iconCode,
      condition: mainCondition,
      description,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 md:p-8 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 shadow-2xl space-y-6"
    >
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Today's Hourly Forecast
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            24-hour temperature trend and atmospheric conditions
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Interactive Trend</span>
        </div>
      </div>

      {/* Hourly Icon Row */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pb-2">
        {hourlyData.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-center hover:border-cyan-500/40 transition-all group"
          >
            <span className="text-[11px] font-semibold text-slate-400 block group-hover:text-cyan-300">
              {item.time}
            </span>
            <img
              src={`https://openweathermap.org/img/wn/${item.icon}.png`}
              alt={item.condition}
              className="w-9 h-9 mx-auto my-0.5 group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-bold text-white block">
              {item.temp}°C
            </span>
          </div>
        ))}
      </div>

      {/* Interactive Recharts Graph */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}°`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#06b6d4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#tempGradient)"
              dot={{ r: 4, fill: '#06b6d4', stroke: '#0f172a', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#22d3ee', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default HourlyForecast;
