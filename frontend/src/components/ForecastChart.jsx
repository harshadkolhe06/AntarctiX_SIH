'use client';

import React from 'react';
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
import { TrendingUp, Cpu } from 'lucide-react';

export default function ForecastChart({ forecasts, telemetry }) {
  if (!forecasts || forecasts.length === 0) return null;

  const firstForecast = forecasts[0] || {};
  const predDemand = firstForecast.predicted_load || telemetry?.current_demand_kw || 140;
  const predRenewables = firstForecast.predicted_total_renewable || ((telemetry?.current_solar_kw || 0) + (telemetry?.current_wind_kw || 0));
  const predGap = firstForecast.predicted_gap || Math.max(0, predDemand - predRenewables);

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
              scikit-learn Random Forest Regressor predictions (t+1h to t+6h)
            </p>
          </div>

          <span className="badge-public">
            RANDOM FOREST ML MODEL
          </span>
        </div>

        {/* 6-Hour Forecast Line Chart */}
        <div className="h-64 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecasts} margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
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
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-montserrat)', paddingTop: '8px' }} />
              
              <Line
                type="monotone"
                dataKey="predicted_load"
                name="Demand (kW)"
                stroke="#EF4444"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#EF4444' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="predicted_solar"
                name="Solar (kW)"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              <Line
                type="monotone"
                dataKey="predicted_wind"
                name="Wind (kW)"
                stroke="#0284C7"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              <Line
                type="monotone"
                dataKey="predicted_total_renewable"
                name="Total Supply (kW)"
                stroke="#10B981"
                strokeWidth={2.5}
              />
              <Line
                type="monotone"
                dataKey="predicted_gap"
                name="Deficit Gap (kW)"
                stroke="#8B5CF6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FORECAST SUMMARY BOX BELOW CHART */}
      <div className="mt-4 pt-3 border-t border-[#E5E7EB] bg-[#F8F9FA] rounded-lg p-3">
        <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase tracking-wider mb-2">
          FORECAST SUMMARY (NEXT 6 HOURS)
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
