'use client';

import React from 'react';
import { Activity, Zap, Shield, Battery, Fuel, Gauge } from 'lucide-react';

export default function KpiCards({ state, kpis }) {
  if (!state) return null;

  const currentDemand = state.current_demand_kw || 0;
  const currentSupply = state.current_total_supply_kw || 0;
  const powerHeadroom = state.power_headroom_kw || 0;
  const batteryUsable = state.battery_derating?.effective_usable_capacity_kwh || 0;
  const batterySoc = state.battery_derating?.soc_percent || 0;
  const fuelReserve = state.station?.diesel_fuel_reserve_l || 0;
  const genStatus = state.generator_health?.status || 'HEALTHY';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {/* 1. CURRENT LOAD */}
      <div className="kpi-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#6B7280]">
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider">CURRENT LOAD</span>
          <Activity className="w-4 h-4 text-[#0284c7]" />
        </div>
        <div className="telemetry-num text-xl font-extrabold text-[#2D3436] my-1">
          {currentDemand} <span className="text-xs font-normal text-[#6B7280]">kW</span>
        </div>
        <div className="text-[10px] text-[#6B7280]">
          Crit: <span className="telemetry-num">{state.allocation?.critical_demand_kw || 0}</span> kW
        </div>
      </div>

      {/* 2. CURRENT SUPPLY */}
      <div className="kpi-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#6B7280]">
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider">CURRENT SUPPLY</span>
          <Zap className="w-4 h-4 text-[#10B981]" />
        </div>
        <div className="telemetry-num text-xl font-extrabold text-[#10B981] my-1">
          {currentSupply} <span className="text-xs font-normal text-[#6B7280]">kW</span>
        </div>
        <div className="text-[10px] text-[#6B7280]">
          {currentSupply >= currentDemand ? 'Supply Satisfied' : 'Deficit Active'}
        </div>
      </div>

      {/* 3. POWER HEADROOM */}
      <div className="kpi-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#6B7280]">
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider">POWER HEADROOM</span>
          <Shield className="w-4 h-4 text-[#0284c7]" />
        </div>
        <div className="telemetry-num text-xl font-extrabold text-[#2D3436] my-1">
          {powerHeadroom} <span className="text-xs font-normal text-[#6B7280]">kW</span>
        </div>
        <div className="text-[10px] text-[#6B7280]">
          Reserve Capacity
        </div>
      </div>

      {/* 4. BATTERY USABLE */}
      <div className="kpi-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#6B7280]">
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider">BATTERY USABLE</span>
          <Battery className="w-4 h-4 text-[#10B981]" />
        </div>
        <div className="telemetry-num text-xl font-extrabold text-[#2D3436] my-1">
          {batteryUsable} <span className="text-xs font-normal text-[#6B7280]">kWh</span>
        </div>
        <div className="text-[10px] text-[#6B7280] flex justify-between">
          <span className="telemetry-num">SOC: {batterySoc}%</span>
          <span className="text-[#F59E0B] font-bold">-{state.battery_derating?.derating_pct}%</span>
        </div>
      </div>

      {/* 5. FUEL RESERVE */}
      <div className="kpi-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#6B7280]">
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider">FUEL RESERVE</span>
          <Fuel className="w-4 h-4 text-[#F59E0B]" />
        </div>
        <div className="telemetry-num text-xl font-extrabold text-[#2D3436] my-1">
          {(fuelReserve/1000).toFixed(1)}k <span className="text-xs font-normal text-[#6B7280]">L</span>
        </div>
        <div className="text-[10px] text-[#6B7280]">
          Burn: <span className="telemetry-num">{state.allocation?.fuel_consumption_lph || 0}</span> L/h
        </div>
      </div>

      {/* 6. GENERATOR STATUS */}
      <div className="kpi-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#6B7280]">
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider">GENERATOR</span>
          <Gauge className="w-4 h-4 text-[#8B5CF6]" />
        </div>
        <div className={`font-heading font-bold text-[#2D3436] text-base truncate my-1 ${
          genStatus === 'HEALTHY' ? 'text-[#10B981]' : 'text-[#EF4444]'
        }`}>
          {genStatus}
        </div>
        <div className="text-[10px] text-[#6B7280]">
          Cap: <span className="telemetry-num">{state.generator_health?.effective_capacity_kw}</span> kW
        </div>
      </div>
    </div>
  );
}
