'use client';

import React from 'react';
import { ArrowRight, Sun, Wind, Battery, Flame, Activity, ShieldAlert, Cpu } from 'lucide-react';

export default function DependencyChainView({ telemetry }) {
  if (!telemetry) return null;

  const weather = telemetry.weather || {};
  const forecasts = telemetry.forecasts || [];
  const allocation = telemetry.allocation || {};
  const shortfall = telemetry.shortfall_risk || {};

  const currentDemand = telemetry.current_demand_kw || 0;
  const solarKw = telemetry.current_solar_kw || 0;
  const windKw = telemetry.current_wind_kw || 0;
  const batteryKw = allocation.battery_used_kw || 0;
  const dieselKw = allocation.diesel_used_kw || 0;
  const gapKw = allocation.remaining_unserved_gap_kw || 0;

  const isCritical = shortfall.status === 'SHORTFALL RISK';
  const isWatch = shortfall.status === 'WATCH';

  const chainStatusColor = isCritical ? 'border-red-400 bg-red-50 text-red-900' : isWatch ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-[#E5E7EB] bg-white text-[#2D3436]';

  return (
    <div className="arctic-card p-4 mb-4">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E5E7EB]">
        <h3 className="font-heading font-bold text-xs text-[#2D3436] tracking-wider uppercase flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-[#0284c7]" />
          PREDICTIVE ENERGY DEPENDENCY CHAIN
        </h3>
        <span className="text-[10px] font-heading font-semibold text-[#6B7280]">
          LIVE DECISION GRAPH
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Node 1: Weather */}
        <div className="p-2.5 rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] min-w-[130px] flex-1">
          <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase">1. WEATHER</div>
          <div className="telemetry-num font-bold text-[#2D3436] mt-0.5">
            {weather.temperature_c}°C | {weather.wind_speed_ms} m/s
          </div>
          <div className="text-[10px] text-[#6B7280]">NASA POWER API</div>
        </div>

        <ArrowRight className="w-4 h-4 text-[#AEE4E5] hidden sm:block flex-shrink-0" />

        {/* Node 2: Forecast */}
        <div className="p-2.5 rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] min-w-[130px] flex-1">
          <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase">2. FORECAST</div>
          <div className="telemetry-num font-bold text-[#2D3436] mt-0.5">
            Demand: {currentDemand} kW
          </div>
          <div className="text-[10px] text-[#6B7280]">Random Forest ML</div>
        </div>

        <ArrowRight className="w-4 h-4 text-[#AEE4E5] hidden sm:block flex-shrink-0" />

        {/* Node 3: Supply vs Demand Gap */}
        <div className={`p-2.5 rounded-lg border min-w-[130px] flex-1 ${chainStatusColor}`}>
          <div className="text-[10px] font-heading font-bold uppercase opacity-80">3. GAP ANALYSIS</div>
          <div className="telemetry-num font-extrabold mt-0.5">
            Gap: {gapKw > 0 ? `${gapKw} kW` : '0 kW (Balanced)'}
          </div>
          <div className="text-[10px] opacity-80">Supply Headroom</div>
        </div>

        <ArrowRight className="w-4 h-4 text-[#AEE4E5] hidden sm:block flex-shrink-0" />

        {/* Node 4: Shortfall Prediction */}
        <div className={`p-2.5 rounded-lg border min-w-[135px] flex-1 ${
          isCritical ? 'bg-red-50 border-red-300 text-red-900' : isWatch ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
        }`}>
          <div className="text-[10px] font-heading font-bold uppercase">4. SHORTFALL PREDICT</div>
          <div className="font-heading font-bold text-xs mt-0.5">
            {shortfall.status}
          </div>
          <div className="telemetry-num text-[10px]">{shortfall.expected_in_hours}</div>
        </div>

        <ArrowRight className="w-4 h-4 text-[#AEE4E5] hidden sm:block flex-shrink-0" />

        {/* Node 5: Smart Allocation */}
        <div className="p-2.5 rounded-lg border border-[#BCE1F4] bg-[#BCE1F4]/20 min-w-[140px] flex-1">
          <div className="text-[10px] font-heading font-bold text-[#2D3436] uppercase">5. SMART ALLOCATION</div>
          <div className="telemetry-num font-extrabold text-[#2D3436] mt-0.5">
            Solar {solarKw}k | Wind {windKw}k
          </div>
          <div className="telemetry-num text-[10px] text-[#6B7280]">
            Bat: {batteryKw}k | Dies: {dieselKw}k
          </div>
        </div>
      </div>
    </div>
  );
}
