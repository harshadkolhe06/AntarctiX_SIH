'use client';

import React from 'react';
import { Layers, Sun, Wind, Battery, Flame, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function EnergyAllocationCard({ allocation }) {
  if (!allocation) return null;

  const {
    demand_kw,
    critical_demand_kw,
    solar_used_kw,
    wind_used_kw,
    battery_used_kw,
    diesel_used_kw,
    total_supplied_kw,
    remaining_unserved_gap_kw,
    non_critical_shed_kw,
    critical_load_met,
    renewable_share_pct,
    fuel_consumption_lph,
    decision_reason,
    recommended_primary_source
  } = allocation;

  const totalDemand = Math.max(1, demand_kw);

  return (
    <div className="arctic-card p-4 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#E5E7EB]">
          <div>
            <h3 className="font-heading font-bold text-xs text-[#2D3436] tracking-wider uppercase flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#10B981]" />
              SMART ENERGY PRIORITY ALLOCATION
            </h3>
            <p className="text-[11px] text-[#6B7280]">
              Strict Priority: 1 Solar → 2 Wind → 3 Battery → 4 Diesel
            </p>
          </div>

          <span className="badge-public">
            RENEWABLE SHARE: {renewable_share_pct}%
          </span>
        </div>

        {/* Recommended Source Plan Bar */}
        <div className="mb-4 p-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-heading font-bold text-[#6B7280]">
            ACTIVE PRIORITY DISPATCH:
          </span>

          <div className="flex items-center space-x-1.5 text-xs">
            {/* Solar */}
            <div className={`px-2.5 py-1 rounded font-heading font-bold text-[11px] flex items-center space-x-1 ${
              solar_used_kw > 0 ? 'bg-[#F59E0B]/20 text-[#B45309] border border-[#F59E0B]/40' : 'bg-[#E5E7EB] text-[#6B7280]'
            }`}>
              <Sun className="w-3 h-3" />
              <span>1 SOLAR (<span className="telemetry-num">{solar_used_kw}</span> kW)</span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-[#6B7280]" />

            {/* Wind */}
            <div className={`px-2.5 py-1 rounded font-heading font-bold text-[11px] flex items-center space-x-1 ${
              wind_used_kw > 0 ? 'bg-[#AEE4E5] text-[#0F766E] border border-[#0F766E]/30' : 'bg-[#E5E7EB] text-[#6B7280]'
            }`}>
              <Wind className="w-3 h-3" />
              <span>2 WIND (<span className="telemetry-num">{wind_used_kw}</span> kW)</span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-[#6B7280]" />

            {/* Battery */}
            <div className={`px-2.5 py-1 rounded font-heading font-bold text-[11px] flex items-center space-x-1 ${
              battery_used_kw > 0 ? 'bg-[#BCE1F4] text-[#075985] border border-[#075985]/30' : 'bg-[#E5E7EB] text-[#6B7280]'
            }`}>
              <Battery className="w-3.5 h-3.5" />
              <span>3 BATTERY (<span className="telemetry-num">{battery_used_kw}</span> kW)</span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-[#6B7280]" />

            {/* Diesel */}
            <div className={`px-2.5 py-1 rounded font-heading font-bold text-[11px] flex items-center space-x-1 ${
              diesel_used_kw > 0 ? 'bg-red-100 text-[#EF4444] border border-red-300' : 'bg-[#E5E7EB] text-[#6B7280]'
            }`}>
              <Flame className="w-3 h-3" />
              <span>4 DIESEL (<span className="telemetry-num">{diesel_used_kw}</span> kW)</span>
            </div>
          </div>
        </div>

        {/* Source Contribution Bars */}
        <div className="space-y-3 mb-4">
          {/* Solar Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#2D3436] mb-1">
              <span className="flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-[#F59E0B]" /> 1. Solar PV Output
              </span>
              <span className="telemetry-num font-bold text-[#F59E0B]">{solar_used_kw} kW</span>
            </div>
            <div className="w-full h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div className="bg-[#F59E0B] h-full transition-all duration-300" style={{ width: `${(solar_used_kw / totalDemand) * 100}%` }} />
            </div>
          </div>

          {/* Wind Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#2D3436] mb-1">
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-[#0284c7]" /> 2. Wind Turbine Output
              </span>
              <span className="telemetry-num font-bold text-[#0284c7]">{wind_used_kw} kW</span>
            </div>
            <div className="w-full h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div className="bg-[#0284c7] h-full transition-all duration-300" style={{ width: `${(wind_used_kw / totalDemand) * 100}%` }} />
            </div>
          </div>

          {/* Battery Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#2D3436] mb-1">
              <span className="flex items-center gap-1">
                <Battery className="w-3.5 h-3.5 text-[#10B981]" /> 3. Battery Discharge
              </span>
              <span className="telemetry-num font-bold text-[#10B981]">{battery_used_kw} kW</span>
            </div>
            <div className="w-full h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div className="bg-[#10B981] h-full transition-all duration-300" style={{ width: `${(battery_used_kw / totalDemand) * 100}%` }} />
            </div>
          </div>

          {/* Diesel Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#2D3436] mb-1">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#EF4444]" /> 4. Diesel Dispatch (Last Resort)
              </span>
              <span className="telemetry-num font-bold text-[#EF4444]">{diesel_used_kw} kW ({fuel_consumption_lph} L/h)</span>
            </div>
            <div className="w-full h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div className="bg-[#EF4444] h-full transition-all duration-300" style={{ width: `${(diesel_used_kw / totalDemand) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Decision Reason Trace */}
      <div className="p-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-xs">
        <div className="font-heading font-bold text-[#2D3436] mb-0.5">Decision Trace:</div>
        <div className="text-[11px] text-[#6B7280] italic">{decision_reason}</div>
      </div>
    </div>
  );
}
