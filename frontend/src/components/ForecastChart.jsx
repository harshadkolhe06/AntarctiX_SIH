'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TrendingUp, Clock } from 'lucide-react';

/**
 * Rounds the current time to the next 30-minute boundary.
 * Examples:
 * - 21:38 -> 22:00
 * - 10:07 -> 10:30
 * - 23:45 -> 00:00 (next day)
 */
function getRoundedStartTime(now) {
  const start = new Date(now);
  start.setSeconds(0);
  start.setMilliseconds(0);
  const mins = start.getMinutes();
  if (mins === 0) {
    // Already on the hour
  } else if (mins <= 30) {
    start.setMinutes(30);
  } else {
    start.setHours(start.getHours() + 1);
    start.setMinutes(0);
  }
  return start;
}

/**
 * Generates 13 30-minute timestamps covering exactly 6 hours from startTime.
 */
function generate30MinTimestamps(startTime, count = 13) {
  const timestamps = [];
  for (let i = 0; i < count; i++) {
    const t = new Date(startTime.getTime() + i * 30 * 60 * 1000);
    const hours = String(t.getHours()).padStart(2, '0');
    const minutes = String(t.getMinutes()).padStart(2, '0');
    timestamps.push({
      date: t,
      hour_label: `${hours}:${minutes}`
    });
  }
  return timestamps;
}

export default function ForecastChart({ forecasts, telemetry }) {
  const [now, setNow] = useState(null);

  // Client-side live clock initialization to prevent SSR hydration mismatch
  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentLocalTime = now || new Date();
  const formattedCurrentTime = currentLocalTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const startTime = getRoundedStartTime(currentLocalTime);
  const timeAxisPoints = generate30MinTimestamps(startTime, 13);

  // Map 13 30-minute timestamps to the backend prediction series
  const chartData = timeAxisPoints.map((point, index) => {
    const rawPoint = (forecasts && forecasts[index]) ? forecasts[index] : null;

    // Fallbacks if forecasts array length differs
    const baseDemand = telemetry?.current_demand_kw || 140;
    const baseSolar = telemetry?.current_solar_kw || 0;
    const baseWind = telemetry?.current_wind_kw || 0;

    const predDemand = rawPoint ? rawPoint.predicted_load : baseDemand;
    const predSolar = rawPoint ? rawPoint.predicted_solar : baseSolar;
    const predWind = rawPoint ? rawPoint.predicted_wind : baseWind;
    const predTotalRenewable = rawPoint ? rawPoint.predicted_total_renewable : (predSolar + predWind);
    const predGap = rawPoint ? rawPoint.predicted_gap : Math.max(0, predDemand - predTotalRenewable);

    return {
      hour_label: point.hour_label,
      full_timestamp: point.date.toLocaleString(),
      predicted_load: predDemand,
      predicted_solar: predSolar,
      predicted_wind: predWind,
      predicted_total_renewable: predTotalRenewable,
      predicted_gap: predGap
    };
  });

  const firstPoint = chartData[0] || {};
  const predDemand = firstPoint.predicted_load || telemetry?.current_demand_kw || 140;
  const predRenewables = firstPoint.predicted_total_renewable || 0;
  const predGap = firstPoint.predicted_gap || 0;

  return (
    <div className="arctic-card p-5 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#E5E7EB]">
          <div>
            <h3 className="font-heading font-bold text-sm text-[#2D3436] tracking-tight flex items-center gap-1.5 uppercase">
              <TrendingUp className="w-4 h-4 text-[#0284c7]" />
              POWER FORECAST — NEXT 6 HOURS
            </h3>
            <p className="text-[11px] text-[#6B7280]">
              Random Forest predictions at 30-minute intervals
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Live Unobtrusive Current Time Indicator */}
            <div className="text-[11px] font-telemetry font-bold text-[#075985] bg-[#BCE1F4]/40 border border-[#a5d5ef] px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0284c7] animate-pulse" />
              <span>CURRENT TIME: {formattedCurrentTime}</span>
            </div>

            <span className="badge-public hidden sm:inline-flex">
              RANDOM FOREST ML MODEL
            </span>
          </div>
        </div>

        {/* 6-Hour Forecast Line Chart (13 30-min intervals) */}
        <div className="h-64 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="hour_label" stroke="#6B7280" fontSize={11} fontFamily="var(--font-jetbrains)" />
              <YAxis stroke="#6B7280" fontSize={11} fontFamily="var(--font-jetbrains)" unit=" kW" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  borderRadius: '8px',
                  color: '#2D3436',
                  fontSize: '12px',
                  fontFamily: 'var(--font-jetbrains)',
                  boxShadow: '0 4px 12px rgba(45,52,54,0.1)'
                }}
                labelFormatter={(label, items) => {
                  const item = items && items[0] && items[0].payload;
                  return item ? `Time: ${label} (${item.full_timestamp})` : `Time: ${label}`;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-montserrat)', paddingTop: '8px' }} />
              
              <Line
                type="monotone"
                dataKey="predicted_load"
                name="Demand (kW)"
                stroke="#EF4444"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#EF4444' }}
                activeDot={{ r: 5.5 }}
              />
              <Line
                type="monotone"
                dataKey="predicted_solar"
                name="Solar (kW)"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#F59E0B' }}
              />
              <Line
                type="monotone"
                dataKey="predicted_wind"
                name="Wind (kW)"
                stroke="#0284C7"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#0284C7' }}
              />
              <Line
                type="monotone"
                dataKey="predicted_total_renewable"
                name="Total Supply (kW)"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#10B981' }}
              />
              <Line
                type="monotone"
                dataKey="predicted_gap"
                name="Deficit Gap (kW)"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ r: 3, fill: '#8B5CF6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FORECAST SUMMARY BOX BELOW CHART */}
      <div className="mt-4 pt-3 border-t border-[#E5E7EB] bg-[#F8F9FA] rounded-lg p-3">
        <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase tracking-wider mb-2">
          FORECAST SUMMARY (NEXT 6 HOURS — 30-MIN INTERVALS)
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 bg-white rounded border border-[#E5E7EB]">
            <div className="text-[10px] text-[#6B7280] uppercase">Demand</div>
            <div className="telemetry-num font-bold text-[#2D3436] mt-0.5">{predDemand} kW</div>
          </div>
          <div className="p-2 bg-white rounded border border-[#E5E7EB]">
            <div className="text-[10px] text-[#6B7280] uppercase">Renewables</div>
            <div className="telemetry-num font-bold text-[#10B981] mt-0.5">{predRenewables} kW</div>
          </div>
          <div className="p-2 bg-white rounded border border-[#E5E7EB]">
            <div className="text-[10px] text-[#6B7280] uppercase">Predicted Gap</div>
            <div className={`telemetry-num font-bold mt-0.5 ${predGap > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
              {predGap} kW
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
