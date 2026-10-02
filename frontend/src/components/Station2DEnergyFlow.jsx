'use client';

import React from 'react';
import { Sun, Wind, Battery, Flame, Cpu, FlaskConical, Home, Snowflake, ShieldCheck, Zap } from 'lucide-react';

export default function Station2DEnergyFlow({ telemetry }) {
  if (!telemetry) return null;

  const allocation = telemetry.allocation || {};
  const solarKw = allocation.solar_used_kw || telemetry.current_solar_kw || 0;
  const windKw = allocation.wind_used_kw || telemetry.current_wind_kw || 0;
  const batteryKw = allocation.battery_used_kw || 0;
  const dieselKw = allocation.diesel_used_kw || 0;
  
  const totalSupply = telemetry.current_total_supply_kw || (solarKw + windKw + batteryKw + dieselKw);
  const totalDemand = telemetry.current_demand_kw || 0;
  const batterySoc = telemetry.battery_derating?.soc_percent ?? 78;

  // Load estimates based on proportions of station load
  const labKw = Math.round(totalDemand * 0.25);
  const livingKw = Math.round(totalDemand * 0.30);
  const hvacKw = Math.round(totalDemand * 0.30);
  const coldKw = Math.round(totalDemand * 0.10);
  const essentialKw = Math.max(1, totalDemand - (labKw + livingKw + hvacKw + coldKw));

  return (
    <div className="arctic-card p-5 h-full flex flex-col justify-between">
      {/* Schematic Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-heading font-extrabold text-sm text-[#2D3436] tracking-tight uppercase">
              2D STATION ENERGY FLOW
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-heading font-bold bg-[#BCE1F4]/40 text-[#075985] border border-[#a5d5ef]">
              SCHEMATIC VIEW
            </span>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-0.5">
            PRAKASH Simulated Polar Energy Distribution Bus (Bharati & Maitri)
          </p>
        </div>

        <div className="badge-simulated">
          SIMULATED ENERGY FLOW
        </div>
      </div>

      {/* 2D Schematic Canvas */}
      <div className="relative bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl p-4 md:p-6 overflow-hidden station-canvas-bg flex-1 flex flex-col justify-between space-y-6">
        
        {/* ================= 1. TOP ROW: ENERGY SOURCES ================= */}
        <div>
          <div className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#6B7280] text-center mb-3">
            PRIMARY RENEWABLE & BACKUP GENERATION SOURCES
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* ☀ SOLAR */}
            <div className={`p-3 rounded-lg border transition-all text-center flex flex-col items-center justify-center ${
              solarKw > 0 
                ? 'bg-amber-50/80 border-[#F59E0B]/50 shadow-sm' 
                : 'bg-white border-[#E5E7EB] opacity-60'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
                solarKw > 0 ? 'bg-[#F59E0B] text-white shadow-sm' : 'bg-gray-100 text-gray-400'
              }`}>
                <Sun className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-xs text-[#2D3436]">SOLAR PV</span>
              <div className="telemetry-num text-sm font-extrabold text-[#F59E0B] mt-0.5">
                {solarKw} <span className="text-[10px] font-normal text-[#6B7280]">kW</span>
              </div>
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mt-1 ${
                solarKw > 0 ? 'bg-[#F59E0B]/20 text-[#B45309]' : 'bg-gray-100 text-gray-500'
              }`}>
                {solarKw > 0 ? 'GENERATING' : 'IDLE / NIGHT'}
              </span>
            </div>

            {/* 🌬 WIND */}
            <div className={`p-3 rounded-lg border transition-all text-center flex flex-col items-center justify-center ${
              windKw > 0 
                ? 'bg-sky-50/80 border-[#0284c7]/50 shadow-sm' 
                : 'bg-white border-[#E5E7EB] opacity-60'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
                windKw > 0 ? 'bg-[#0284c7] text-white shadow-sm' : 'bg-gray-100 text-gray-400'
              }`}>
                <Wind className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-xs text-[#2D3436]">WIND TURBINE</span>
              <div className="telemetry-num text-sm font-extrabold text-[#0284c7] mt-0.5">
                {windKw} <span className="text-[10px] font-normal text-[#6B7280]">kW</span>
              </div>
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mt-1 ${
                windKw > 0 ? 'bg-[#0284c7]/20 text-[#0369a1]' : 'bg-gray-100 text-gray-500'
              }`}>
                {windKw > 0 ? 'GENERATING' : 'NO WIND'}
              </span>
            </div>

            {/* 🔋 BATTERY */}
            <div className={`p-3 rounded-lg border transition-all text-center flex flex-col items-center justify-center ${
              batteryKw > 0 
                ? 'bg-emerald-50/80 border-[#10B981]/50 shadow-sm' 
                : 'bg-white border-[#E5E7EB]'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
                batteryKw > 0 ? 'bg-[#10B981] text-white shadow-sm' : 'bg-[#BCE1F4] text-[#075985]'
              }`}>
                <Battery className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-xs text-[#2D3436]">BATTERY BANK</span>
              <div className="telemetry-num text-sm font-extrabold text-[#10B981] mt-0.5">
                {batteryKw > 0 ? `${batteryKw} kW` : `${batterySoc}% SOC`}
              </div>
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mt-1 ${
                batteryKw > 0 ? 'bg-[#10B981]/20 text-[#047857]' : 'bg-[#BCE1F4]/30 text-[#075985]'
              }`}>
                {batteryKw > 0 ? 'DISCHARGING' : 'RESERVE HOLD'}
              </span>
            </div>

            {/* ⚡ DIESEL */}
            <div className={`p-3 rounded-lg border transition-all text-center flex flex-col items-center justify-center ${
              dieselKw > 0 
                ? 'bg-red-50/90 border-[#EF4444]/60 shadow-sm' 
                : 'bg-white border-[#E5E7EB] opacity-75'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
                dieselKw > 0 ? 'bg-[#EF4444] text-white shadow-sm animate-pulse' : 'bg-gray-100 text-gray-400'
              }`}>
                <Flame className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-xs text-[#2D3436]">DIESEL BACKUP</span>
              <div className="telemetry-num text-sm font-extrabold text-[#EF4444] mt-0.5">
                {dieselKw > 0 ? `${dieselKw} kW` : '0 kW'}
              </div>
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mt-1 ${
                dieselKw > 0 ? 'bg-[#EF4444]/20 text-[#b91c1c] animate-pulse' : 'bg-gray-100 text-gray-600'
              }`}>
                {dieselKw > 0 ? 'ACTIVE DISPATCH' : 'STANDBY'}
              </span>
            </div>
          </div>
        </div>

        {/* ================= SVG ANIMATED CONNECTORS (TOP → BUS) ================= */}
        <div className="relative h-8 flex items-center justify-center">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 30">
            {/* Solar to Bus */}
            <line 
              x1="50" y1="0" x2="200" y2="30" 
              stroke={solarKw > 0 ? "#F59E0B" : "#CBD5E1"} 
              strokeWidth={solarKw > 0 ? "2.5" : "1.5"} 
              className={solarKw > 0 ? "energy-flow-active" : "energy-flow-standby"}
            />
            {/* Wind to Bus */}
            <line 
              x1="150" y1="0" x2="200" y2="30" 
              stroke={windKw > 0 ? "#0284c7" : "#CBD5E1"} 
              strokeWidth={windKw > 0 ? "2.5" : "1.5"} 
              className={windKw > 0 ? "energy-flow-active" : "energy-flow-standby"}
            />
            {/* Battery to Bus */}
            <line 
              x1="250" y1="0" x2="200" y2="30" 
              stroke={batteryKw > 0 ? "#10B981" : "#CBD5E1"} 
              strokeWidth={batteryKw > 0 ? "2.5" : "1.5"} 
              className={batteryKw > 0 ? "energy-flow-active" : "energy-flow-standby"}
            />
            {/* Diesel to Bus */}
            <line 
              x1="350" y1="0" x2="200" y2="30" 
              stroke={dieselKw > 0 ? "#EF4444" : "#CBD5E1"} 
              strokeWidth={dieselKw > 0 ? "3" : "1.5"} 
              className={dieselKw > 0 ? "energy-flow-active" : "energy-flow-standby"}
            />
          </svg>
        </div>

        {/* ================= 2. CENTRAL ELEMENT: MAIN ENERGY BUS ================= */}
        <div className="relative bg-[#2D3436] text-white rounded-xl p-4 border-2 border-[#BCE1F4] shadow-md flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#BCE1F4] text-[#2D3436] flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 text-[#2D3436]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-extrabold text-sm tracking-wider uppercase text-white">
                  MAIN ENERGY BUS
                </span>
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              </div>
              <p className="text-[11px] text-[#AEE4E5]">
                400V 3-Phase AC Distribution Node (Polar Edge SCADA Controlled)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 border-l border-[#6B7280]/40 pl-4">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-[#AEE4E5] font-heading">TOTAL GENERATION</div>
              <div className="telemetry-num text-lg font-extrabold text-[#10B981]">{totalSupply} kW</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-[#B5CBF0] font-heading">TOTAL LOAD</div>
              <div className="telemetry-num text-lg font-extrabold text-white">{totalDemand} kW</div>
            </div>
          </div>
        </div>

        {/* ================= SVG ANIMATED CONNECTORS (BUS → LOADS) ================= */}
        <div className="relative h-8 flex items-center justify-center">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 30">
            {/* Bus to Labs */}
            <line x1="250" y1="0" x2="50" y2="30" stroke="#0284c7" strokeWidth="2" className="energy-flow-active" />
            {/* Bus to Living */}
            <line x1="250" y1="0" x2="150" y2="30" stroke="#0284c7" strokeWidth="2" className="energy-flow-active" />
            {/* Bus to HVAC */}
            <line x1="250" y1="0" x2="250" y2="30" stroke="#0284c7" strokeWidth="2" className="energy-flow-active" />
            {/* Bus to Cold Storage */}
            <line x1="250" y1="0" x2="350" y2="30" stroke="#0284c7" strokeWidth="2" className="energy-flow-active" />
            {/* Bus to Essential */}
            <line x1="250" y1="0" x2="450" y2="30" stroke="#0284c7" strokeWidth="2" className="energy-flow-active" />
          </svg>
        </div>

        {/* ================= 3. BOTTOM ROW: STATION LOADS ================= */}
        <div>
          <div className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#6B7280] text-center mb-3">
            STATION CONSUMPTION LOADS
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {/* 1. LABORATORIES */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-2.5 text-center flex flex-col items-center">
              <FlaskConical className="w-4 h-4 text-[#0284c7] mb-1" />
              <span className="font-heading font-bold text-[11px] text-[#2D3436]">LABORATORIES</span>
              <span className="telemetry-num text-xs font-bold text-[#0284c7]">{labKw} kW</span>
              <span className="text-[9px] text-[#6B7280] mt-0.5">Scientific SCADA</span>
            </div>

            {/* 2. LIVING QUARTERS */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-2.5 text-center flex flex-col items-center">
              <Home className="w-4 h-4 text-[#0284c7] mb-1" />
              <span className="font-heading font-bold text-[11px] text-[#2D3436]">HABITATION</span>
              <span className="telemetry-num text-xs font-bold text-[#0284c7]">{livingKw} kW</span>
              <span className="text-[9px] text-[#6B7280] mt-0.5">Quarters & Crew</span>
            </div>

            {/* 3. HVAC / HEATING */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-2.5 text-center flex flex-col items-center">
              <Cpu className="w-4 h-4 text-[#0284c7] mb-1" />
              <span className="font-heading font-bold text-[11px] text-[#2D3436]">HVAC HEATING</span>
              <span className="telemetry-num text-xs font-bold text-[#0284c7]">{hvacKw} kW</span>
              <span className="text-[9px] text-[#6B7280] mt-0.5">Glycol Loop</span>
            </div>

            {/* 4. COLD STORAGE */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-2.5 text-center flex flex-col items-center">
              <Snowflake className="w-4 h-4 text-[#0284c7] mb-1" />
              <span className="font-heading font-bold text-[11px] text-[#2D3436]">COLD STORAGE</span>
              <span className="telemetry-num text-xs font-bold text-[#0284c7]">{coldKw} kW</span>
              <span className="text-[9px] text-[#6B7280] mt-0.5">Sample Preserves</span>
            </div>

            {/* 5. ESSENTIAL LOADS */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-2.5 text-center flex flex-col items-center col-span-2 sm:col-span-1">
              <ShieldCheck className="w-4 h-4 text-[#10B981] mb-1" />
              <span className="font-heading font-bold text-[11px] text-[#2D3436]">ESSENTIALS</span>
              <span className="telemetry-num text-xs font-bold text-[#10B981]">{essentialKw} kW</span>
              <span className="text-[9px] text-[#6B7280] mt-0.5">Life Support & Comms</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
