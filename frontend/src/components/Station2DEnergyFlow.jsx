'use client';

import React from 'react';
import { Sun, Wind, Battery, Flame, Cpu, FlaskConical, Home, Snowflake, ShieldCheck, Zap } from 'lucide-react';

export default function Station2DEnergyFlow({ telemetry }) {
  if (!telemetry) return null;

  const allocation = telemetry.allocation || {};
  const solarKw = allocation.solar_used_kw ?? telemetry.current_solar_kw ?? 0;
  const windKw = allocation.wind_used_kw ?? telemetry.current_wind_kw ?? 0;
  const batteryKw = allocation.battery_used_kw ?? 0;
  const dieselKw = allocation.diesel_used_kw ?? 0;
  
  const totalSupply = telemetry.current_total_supply_kw || (solarKw + windKw + batteryKw + dieselKw);
  const totalDemand = telemetry.current_demand_kw || 0;
  const batterySoc = telemetry.battery_derating?.soc_percent ?? 78;

  // Active status booleans for dynamic power flow
  const isSolarActive = solarKw > 0;
  const isWindActive = windKw > 0;
  const isBatteryActive = batteryKw > 0;
  const isDieselActive = dieselKw > 0;

  const anyActiveSource = isSolarActive || isWindActive || isBatteryActive || isDieselActive;

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
              isSolarActive 
                ? 'bg-emerald-50/90 border-[#10B981]/50 shadow-sm' 
                : 'bg-red-50/50 border-red-200 opacity-75'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
                isSolarActive ? 'bg-[#10B981] text-white shadow-sm' : 'bg-red-100 text-[#EF4444]'
              }`}>
                <Sun className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-xs text-[#2D3436]">SOLAR PV</span>
              <div className={`telemetry-num text-sm font-extrabold mt-0.5 ${
                isSolarActive ? 'text-[#10B981]' : 'text-[#EF4444]'
              }`}>
                {solarKw} <span className="text-[10px] font-normal text-[#6B7280]">kW</span>
              </div>
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mt-1 ${
                isSolarActive ? 'bg-[#10B981]/20 text-[#047857]' : 'bg-red-100 text-[#EF4444] border border-red-300'
              }`}>
                {isSolarActive ? 'GENERATING' : 'IDLE / NIGHT'}
              </span>
            </div>

            {/* 🌬 WIND */}
            <div className={`p-3 rounded-lg border transition-all text-center flex flex-col items-center justify-center ${
              isWindActive 
                ? 'bg-emerald-50/90 border-[#10B981]/50 shadow-sm' 
                : 'bg-red-50/50 border-red-200 opacity-75'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
                isWindActive ? 'bg-[#10B981] text-white shadow-sm' : 'bg-red-100 text-[#EF4444]'
              }`}>
                <Wind className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-xs text-[#2D3436]">WIND TURBINE</span>
              <div className={`telemetry-num text-sm font-extrabold mt-0.5 ${
                isWindActive ? 'text-[#10B981]' : 'text-[#EF4444]'
              }`}>
                {windKw} <span className="text-[10px] font-normal text-[#6B7280]">kW</span>
              </div>
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mt-1 ${
                isWindActive ? 'bg-[#10B981]/20 text-[#047857]' : 'bg-red-100 text-[#EF4444] border border-red-300'
              }`}>
                {isWindActive ? 'GENERATING' : 'NO WIND'}
              </span>
            </div>

            {/* 🔋 BATTERY */}
            <div className={`p-3 rounded-lg border transition-all text-center flex flex-col items-center justify-center ${
              isBatteryActive 
                ? 'bg-emerald-50/90 border-[#10B981]/50 shadow-sm' 
                : 'bg-red-50/50 border-red-200 opacity-75'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
                isBatteryActive ? 'bg-[#10B981] text-white shadow-sm' : 'bg-red-100 text-[#EF4444]'
              }`}>
                <Battery className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-xs text-[#2D3436]">BATTERY BANK</span>
              <div className={`telemetry-num text-sm font-extrabold mt-0.5 ${
                isBatteryActive ? 'text-[#10B981]' : 'text-[#EF4444]'
              }`}>
                {isBatteryActive ? `${batteryKw} kW` : `${batterySoc}% SOC`}
              </div>
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mt-1 ${
                isBatteryActive ? 'bg-[#10B981]/20 text-[#047857]' : 'bg-red-100 text-[#EF4444] border border-red-300'
              }`}>
                {isBatteryActive ? 'DISCHARGING' : 'STANDBY'}
              </span>
            </div>

            {/* ⚡ DIESEL */}
            <div className={`p-3 rounded-lg border transition-all text-center flex flex-col items-center justify-center ${
              isDieselActive 
                ? 'bg-emerald-50/90 border-[#10B981]/50 shadow-sm' 
                : 'bg-red-50/50 border-red-200 opacity-75'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
                isDieselActive ? 'bg-[#10B981] text-white shadow-sm animate-pulse' : 'bg-red-100 text-[#EF4444]'
              }`}>
                <Flame className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-xs text-[#2D3436]">DIESEL BACKUP</span>
              <div className={`telemetry-num text-sm font-extrabold mt-0.5 ${
                isDieselActive ? 'text-[#10B981]' : 'text-[#EF4444]'
              }`}>
                {isDieselActive ? `${dieselKw} kW` : '0 kW'}
              </div>
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mt-1 ${
                isDieselActive ? 'bg-[#10B981]/20 text-[#047857]' : 'bg-red-100 text-[#EF4444] border border-red-300'
              }`}>
                {isDieselActive ? 'ACTIVE DISPATCH' : 'NOT DISPATCHED'}
              </span>
            </div>
          </div>
        </div>

        {/* ================= SVG ANIMATED CONNECTORS (TOP SOURCES → NODE) ================= */}
        <div className="relative h-10 flex items-center justify-center">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 30">
            {/* Solar to Bus */}
            <line 
              x1="50" y1="0" x2="200" y2="30" 
              stroke={isSolarActive ? "#10B981" : "#EF4444"} 
              strokeWidth={isSolarActive ? "3" : "2"} 
              className={isSolarActive ? "energy-flow-active" : "energy-flow-inactive"}
            />
            {/* Wind to Bus */}
            <line 
              x1="150" y1="0" x2="200" y2="30" 
              stroke={isWindActive ? "#10B981" : "#EF4444"} 
              strokeWidth={isWindActive ? "3" : "2"} 
              className={isWindActive ? "energy-flow-active" : "energy-flow-inactive"}
            />
            {/* Battery to Bus */}
            <line 
              x1="250" y1="0" x2="200" y2="30" 
              stroke={isBatteryActive ? "#10B981" : "#EF4444"} 
              strokeWidth={isBatteryActive ? "3" : "2"} 
              className={isBatteryActive ? "energy-flow-active" : "energy-flow-inactive"}
            />
            {/* Diesel to Bus */}
            <line 
              x1="350" y1="0" x2="200" y2="30" 
              stroke={isDieselActive ? "#10B981" : "#EF4444"} 
              strokeWidth={isDieselActive ? "3" : "2"} 
              className={isDieselActive ? "energy-flow-active" : "energy-flow-inactive"}
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
                  400V 3-PHASE AC DISTRIBUTION NODE
                </span>
                {anyActiveSource && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                )}
              </div>
              <p className="text-[11px] text-[#AEE4E5]">
                (Polar Edge SCADA Controlled)
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

        {/* ================= SVG CONNECTORS (NODE → LOADS) ================= */}
        <div className="relative h-8 flex items-center justify-center">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 30">
            {/* Bus to Labs */}
            <line x1="250" y1="0" x2="50" y2="30" stroke="#0284c7" strokeWidth="2" className={totalSupply > 0 ? "energy-flow-load" : "energy-flow-inactive"} />
            {/* Bus to Living */}
            <line x1="250" y1="0" x2="150" y2="30" stroke="#0284c7" strokeWidth="2" className={totalSupply > 0 ? "energy-flow-load" : "energy-flow-inactive"} />
            {/* Bus to HVAC */}
            <line x1="250" y1="0" x2="250" y2="30" stroke="#0284c7" strokeWidth="2" className={totalSupply > 0 ? "energy-flow-load" : "energy-flow-inactive"} />
            {/* Bus to Cold Storage */}
            <line x1="250" y1="0" x2="350" y2="30" stroke="#0284c7" strokeWidth="2" className={totalSupply > 0 ? "energy-flow-load" : "energy-flow-inactive"} />
            {/* Bus to Essential */}
            <line x1="250" y1="0" x2="450" y2="30" stroke="#0284c7" strokeWidth="2" className={totalSupply > 0 ? "energy-flow-load" : "energy-flow-inactive"} />
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
