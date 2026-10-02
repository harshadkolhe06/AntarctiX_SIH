'use client';

import React from 'react';
import { Activity, Zap, Battery, ShieldAlert } from 'lucide-react';

export default function OverviewKpiCards({ state }) {
  if (!state) return null;

  const currentDemand = state.current_demand_kw || 0;
  const currentSupply = state.current_total_supply_kw || 0;
  const batterySoc = state.battery_derating?.soc_percent ?? 78;
  const batteryUsable = state.battery_derating?.effective_usable_capacity_kwh || 0;
  
  const shortfallRisk = state.shortfall_risk || {};
  const riskStatus = shortfallRisk.status || 'LOW';
  const riskProb = shortfallRisk.shortfall_probability_pct ?? 12.0;

  const getRiskColor = (status) => {
    if (status === 'SHORTFALL RISK') {
      return { text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/30', label: 'CRITICAL' };
    } else if (status === 'WATCH') {
      return { text: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', label: 'WATCH' };
    }
    return { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30', label: 'LOW' };
  };

  const riskMeta = getRiskColor(riskStatus);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. CURRENT DEMAND */}
      <div className="arctic-card p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#6B7280]">
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider">CURRENT DEMAND</span>
          <div className="p-1.5 rounded-md bg-[#BCE1F4]/40 text-[#0284c7]">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 mb-1">
          <span className="telemetry-num text-2xl font-extrabold text-[#2D3436] tracking-tight">{currentDemand}</span>
          <span className="ml-1.5 text-xs font-semibold text-[#6B7280]">kW</span>
        </div>
        <div className="text-[11px] text-[#6B7280] flex justify-between items-center border-t border-[#E5E7EB]/60 pt-2 mt-1">
          <span>Critical Load:</span>
          <span className="telemetry-num font-bold text-[#2D3436]">{state.allocation?.critical_demand_kw || 0} kW</span>
        </div>
      </div>

      {/* 2. POWER SUPPLY */}
      <div className="arctic-card p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#6B7280]">
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider">POWER SUPPLY</span>
          <div className="p-1.5 rounded-md bg-[#10B981]/15 text-[#10B981]">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 mb-1">
          <span className="telemetry-num text-2xl font-extrabold text-[#10B981] tracking-tight">{currentSupply}</span>
          <span className="ml-1.5 text-xs font-semibold text-[#6B7280]">kW</span>
        </div>
        <div className="text-[11px] text-[#6B7280] flex justify-between items-center border-t border-[#E5E7EB]/60 pt-2 mt-1">
          <span>Status:</span>
          <span className={`font-bold ${currentSupply >= currentDemand ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
            {currentSupply >= currentDemand ? '100% Satisfied' : 'Supply Deficit'}
          </span>
        </div>
      </div>

      {/* 3. BATTERY */}
      <div className="arctic-card p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#6B7280]">
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider">BATTERY</span>
          <div className="p-1.5 rounded-md bg-[#BCE1F4]/40 text-[#075985]">
            <Battery className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 mb-1 flex items-baseline justify-between">
          <div>
            <span className="telemetry-num text-2xl font-extrabold text-[#2D3436] tracking-tight">{batterySoc}</span>
            <span className="ml-0.5 text-base font-bold text-[#6B7280]">%</span>
          </div>
          <span className="text-xs font-heading font-bold text-[#075985] bg-[#BCE1F4]/30 px-2 py-0.5 rounded">
            {batteryUsable} kWh
          </span>
        </div>
        <div className="text-[11px] text-[#6B7280] flex justify-between items-center border-t border-[#E5E7EB]/60 pt-2 mt-1">
          <span>Cold Derating:</span>
          <span className="font-bold text-[#F59E0B]">-{state.battery_derating?.derating_pct || 0}% ({state.weather?.temp_c || 0}°C)</span>
        </div>
      </div>

      {/* 4. ENERGY RISK */}
      <div className="arctic-card p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#6B7280]">
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider">ENERGY RISK</span>
          <div className={`p-1.5 rounded-md ${riskMeta.bg} ${riskMeta.text}`}>
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 mb-1 flex items-baseline space-x-2">
          <span className={`font-heading font-extrabold text-2xl tracking-tight ${riskMeta.text}`}>
            {riskMeta.label}
          </span>
          <span className="telemetry-num text-sm font-bold text-[#6B7280]">
            {riskProb}%
          </span>
        </div>
        <div className="text-[11px] text-[#6B7280] flex justify-between items-center border-t border-[#E5E7EB]/60 pt-2 mt-1">
          <span>Lead Time:</span>
          <span className="telemetry-num font-bold text-[#2D3436]">
            {shortfallRisk.lead_time_hours ? `${shortfallRisk.lead_time_hours}h Advance` : 'Stable Operation'}
          </span>
        </div>
      </div>
    </div>
  );
}
