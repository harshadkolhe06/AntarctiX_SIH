'use client';

import React from 'react';
import { Snowflake, Battery, AlertCircle } from 'lucide-react';

export default function BatteryDeratingCard({ batteryDerating }) {
  if (!batteryDerating) return null;

  const {
    temperature_c,
    nominal_capacity_kwh,
    soc_percent,
    derating_pct,
    derated_capacity_kwh,
    effective_usable_capacity_kwh,
    max_discharge_kw,
    derating_label,
    explanation,
    is_simulated_rule
  } = batteryDerating;

  return (
    <div className="arctic-card p-4 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#E5E7EB]">
          <div>
            <h3 className="font-heading font-bold text-xs text-[#2D3436] tracking-wider uppercase flex items-center gap-1.5">
              <Snowflake className="w-4 h-4 text-[#0284c7]" />
              COLD-WEATHER BATTERY DERATING MODEL
            </h3>
            <p className="text-[11px] text-[#6B7280]">
              Antarctic thermal battery capacity derating equation (-10°C: 15%, -20°C: 35%)
            </p>
          </div>

          <span className="badge-public">
            RULE-BASED THERMAL MODEL
          </span>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <div className="p-2.5 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
            <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase">Nominal Cap</div>
            <div className="telemetry-num text-sm font-bold text-[#2D3436] mt-0.5">{nominal_capacity_kwh} kWh</div>
            <div className="text-[10px] text-[#6B7280]">Rated energy bank</div>
          </div>

          <div className="p-2.5 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
            <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase">Temp & SOC</div>
            <div className="telemetry-num text-sm font-bold text-[#2D3436] mt-0.5">{temperature_c}°C | {soc_percent}%</div>
            <div className="text-[10px] text-[#6B7280]">State of Charge</div>
          </div>

          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-[10px] font-heading font-bold text-amber-800 uppercase">Cold Derating</div>
            <div className="telemetry-num text-sm font-bold text-[#F59E0B] mt-0.5">-{derating_pct}%</div>
            <div className="text-[10px] text-amber-800 truncate">{derating_label}</div>
          </div>

          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="text-[10px] font-heading font-bold text-emerald-800 uppercase">Effective Usable</div>
            <div className="telemetry-num text-sm font-extrabold text-[#10B981] mt-0.5">{effective_usable_capacity_kwh} kWh</div>
            <div className="text-[10px] text-emerald-800">Max Discharge: <span className="telemetry-num">{max_discharge_kw}</span> kW</div>
          </div>
        </div>

        {/* Capacity Breakdown Progress Bar */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-[11px] font-semibold text-[#2D3436]">
            <span>Capacity Derating Breakdown</span>
            <span className="telemetry-num">{effective_usable_capacity_kwh} kWh usable of {nominal_capacity_kwh} kWh</span>
          </div>
          <div className="w-full h-3 bg-[#E5E7EB] rounded-full overflow-hidden flex">
            <div
              className="bg-[#10B981] h-full transition-all duration-300"
              style={{ width: `${(effective_usable_capacity_kwh / nominal_capacity_kwh) * 100}%` }}
              title={`Usable Energy: ${effective_usable_capacity_kwh} kWh`}
            />
            <div
              className="bg-[#AEE4E5] h-full transition-all duration-300"
              style={{ width: `${((derated_capacity_kwh - effective_usable_capacity_kwh) / nominal_capacity_kwh) * 100}%` }}
              title={`Uncharged Capacity: ${derated_capacity_kwh - effective_usable_capacity_kwh} kWh`}
            />
            <div
              className="bg-[#F59E0B] h-full transition-all duration-300"
              style={{ width: `${derating_pct}%` }}
              title={`Cold Thermal Derating Loss: ${nominal_capacity_kwh - derated_capacity_kwh} kWh`}
            />
          </div>
        </div>
      </div>

      {/* Formula Trace */}
      <div className="p-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-xs text-[#6B7280]">
        <span className="font-heading font-bold text-[#2D3436]">Thermal Equation: </span>
        {explanation}
      </div>
    </div>
  );
}
