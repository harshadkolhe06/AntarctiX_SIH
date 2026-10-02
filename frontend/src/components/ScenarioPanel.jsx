'use client';

import React from 'react';
import { Sliders, RefreshCw, ArrowRightLeft, ShieldAlert, Sparkles } from 'lucide-react';

const SCENARIOS = [
  { id: 'NORMAL', label: 'Normal Operation (Baseline)' },
  { id: 'LOW_WIND', label: '5-Day Low Wind (1.8 m/s)' },
  { id: 'EXTREME_COLD', label: 'Extreme Cold Snap (-38°C)' },
  { id: 'HIGH_LOAD', label: 'High Research Load (+60%)' },
  { id: 'LOW_SOLAR', label: 'Low Solar / Blizzard' },
  { id: 'GENERATOR_FAILURE', label: 'Generator #1 Failure' },
  { id: 'OFFLINE', label: 'Communication Outage' },
];

export default function ScenarioPanel({
  activeScenarioId,
  onSelectScenario,
  beforeVsAfter
}) {
  const isSimulatedScenario = activeScenarioId !== 'NORMAL';

  return (
    <div className={`arctic-card p-4 transition-all ${
      isSimulatedScenario ? 'border-[#8B5CF6]/40 bg-[#8B5CF6]/5' : ''
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-heading font-bold text-xs text-[#2D3436] tracking-wider uppercase flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#8B5CF6]" />
              WHAT-IF SIMULATION & STRESS TEST
            </h3>
            {isSimulatedScenario && (
              <span className="badge-simulated">
                SIMULATED SCENARIO ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#6B7280]">
            Select an Antarctic scenario to recompute ML forecast, battery derating, gap analysis, and source allocation.
          </p>
        </div>

        {/* Live / Simulation Mode Toggle */}
        <div className="inline-flex p-0.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg">
          <button
            onClick={() => onSelectScenario('NORMAL')}
            className={`px-3 py-1 rounded-md font-heading font-bold text-xs transition-all ${
              !isSimulatedScenario
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#2D3436]'
            }`}
          >
            ● LIVE
          </button>
          <button
            onClick={() => onSelectScenario(activeScenarioId === 'NORMAL' ? 'EXTREME_COLD' : activeScenarioId)}
            className={`px-3 py-1 rounded-md font-heading font-bold text-xs transition-all ${
              isSimulatedScenario
                ? 'bg-[#8B5CF6] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#2D3436]'
            }`}
          >
            ⚡ SIMULATION
          </button>
        </div>
      </div>

      {/* Scenario Buttons Row */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        {SCENARIOS.map((sc) => {
          const isActive = sc.id === activeScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`px-3 py-1.5 rounded-lg font-heading text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                  : 'bg-white text-[#2D3436] hover:bg-[#F8F9FA] border border-[#E5E7EB]'
              }`}
            >
              {sc.label}
            </button>
          );
        })}
      </div>

      {/* BEFORE VS AFTER METRICS TABLE */}
      {beforeVsAfter && (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E5E7EB]">
            <div className="flex items-center space-x-2">
              <ArrowRightLeft className="w-4 h-4 text-[#8B5CF6]" />
              <h4 className="font-heading font-bold text-xs text-[#2D3436] uppercase">
                BEFORE → AFTER IMPACT: {beforeVsAfter.scenario_name}
              </h4>
            </div>
            <p className="text-[11px] text-[#6B7280] italic max-w-md text-right">
              "{beforeVsAfter.description}"
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[#6B7280] font-heading font-bold uppercase">
                  <th className="py-2 px-3">Telemetry Metric</th>
                  <th className="py-2 px-3 bg-[#F8F9FA] text-[#2D3436]">BEFORE (Normal Baseline)</th>
                  <th className="py-2 px-3 bg-[#8B5CF6]/10 text-[#8B5CF6]">AFTER ({beforeVsAfter.scenario_name})</th>
                  <th className="py-2 px-3">Variance Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] font-medium text-[#2D3436]">
                <tr>
                  <td className="py-2 px-3 font-heading font-semibold">Station Demand (kW)</td>
                  <td className="telemetry-num py-2 px-3 bg-[#F8F9FA]">{beforeVsAfter.before.demand_kw} kW</td>
                  <td className="telemetry-num py-2 px-3 bg-[#8B5CF6]/5 font-bold">{beforeVsAfter.after.demand_kw} kW</td>
                  <td className="telemetry-num py-2 px-3 text-[#6B7280]">{formatDelta(beforeVsAfter.after.demand_kw - beforeVsAfter.before.demand_kw, 'kW')}</td>
                </tr>

                <tr>
                  <td className="py-2 px-3 font-heading font-semibold">Solar Output (kW)</td>
                  <td className="telemetry-num py-2 px-3 bg-[#F8F9FA]">{beforeVsAfter.before.solar_kw} kW</td>
                  <td className="telemetry-num py-2 px-3 bg-[#8B5CF6]/5 font-bold">{beforeVsAfter.after.solar_kw} kW</td>
                  <td className="telemetry-num py-2 px-3 text-[#6B7280]">{formatDelta(beforeVsAfter.after.solar_kw - beforeVsAfter.before.solar_kw, 'kW')}</td>
                </tr>

                <tr>
                  <td className="py-2 px-3 font-heading font-semibold">Wind Output (kW)</td>
                  <td className="telemetry-num py-2 px-3 bg-[#F8F9FA]">{beforeVsAfter.before.wind_kw} kW</td>
                  <td className="telemetry-num py-2 px-3 bg-[#8B5CF6]/5 font-bold">{beforeVsAfter.after.wind_kw} kW</td>
                  <td className="telemetry-num py-2 px-3 text-[#6B7280]">{formatDelta(beforeVsAfter.after.wind_kw - beforeVsAfter.before.wind_kw, 'kW')}</td>
                </tr>

                <tr>
                  <td className="py-2 px-3 font-heading font-semibold">Battery Discharged (kW)</td>
                  <td className="telemetry-num py-2 px-3 bg-[#F8F9FA]">{beforeVsAfter.before.battery_kw} kW</td>
                  <td className="telemetry-num py-2 px-3 bg-[#8B5CF6]/5 font-bold">{beforeVsAfter.after.battery_kw} kW</td>
                  <td className="telemetry-num py-2 px-3 text-[#6B7280]">{formatDelta(beforeVsAfter.after.battery_kw - beforeVsAfter.before.battery_kw, 'kW')}</td>
                </tr>

                <tr>
                  <td className="py-2 px-3 font-heading font-semibold">Diesel Dispatched (kW)</td>
                  <td className="telemetry-num py-2 px-3 bg-[#F8F9FA]">{beforeVsAfter.before.diesel_kw} kW</td>
                  <td className="telemetry-num py-2 px-3 bg-[#8B5CF6]/5 font-bold text-[#EF4444]">{beforeVsAfter.after.diesel_kw} kW</td>
                  <td className="telemetry-num py-2 px-3 text-[#6B7280]">{formatDelta(beforeVsAfter.after.diesel_kw - beforeVsAfter.before.diesel_kw, 'kW')}</td>
                </tr>

                <tr>
                  <td className="py-2 px-3 font-heading font-semibold">Usable Battery (kWh)</td>
                  <td className="telemetry-num py-2 px-3 bg-[#F8F9FA]">{beforeVsAfter.before.battery_effective_usable_kwh} kWh</td>
                  <td className="telemetry-num py-2 px-3 bg-[#8B5CF6]/5 font-bold">{beforeVsAfter.after.battery_effective_usable_kwh} kWh</td>
                  <td className="telemetry-num py-2 px-3 text-[#6B7280]">{formatDelta(beforeVsAfter.after.battery_effective_usable_kwh - beforeVsAfter.before.battery_effective_usable_kwh, 'kWh')}</td>
                </tr>

                <tr>
                  <td className="py-2 px-3 font-heading font-semibold">Renewable Share %</td>
                  <td className="telemetry-num py-2 px-3 bg-[#F8F9FA]">{beforeVsAfter.before.renewable_share_pct}%</td>
                  <td className="telemetry-num py-2 px-3 bg-[#8B5CF6]/5 font-bold text-[#10B981]">{beforeVsAfter.after.renewable_share_pct}%</td>
                  <td className="telemetry-num py-2 px-3 text-[#6B7280]">{formatDelta(beforeVsAfter.after.renewable_share_pct - beforeVsAfter.before.renewable_share_pct, '%')}</td>
                </tr>

                <tr>
                  <td className="py-2 px-3 font-heading font-semibold">System Risk Status</td>
                  <td className="font-heading font-bold py-2 px-3 bg-[#F8F9FA] text-[#10B981]">{beforeVsAfter.before.risk_status}</td>
                  <td className={`font-heading font-bold py-2 px-3 bg-[#8B5CF6]/5 ${
                    beforeVsAfter.after.risk_status === 'NORMAL' ? 'text-[#10B981]' : 'text-[#EF4444]'
                  }`}>
                    {beforeVsAfter.after.risk_status}
                  </td>
                  <td className="font-heading font-bold py-2 px-3 text-[#2D3436]">
                    {beforeVsAfter.before.risk_status} → {beforeVsAfter.after.risk_status}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDelta(val, unit) {
  const rounded = Math.round(val * 10) / 10;
  if (rounded > 0) return `+${rounded} ${unit}`;
  if (rounded < 0) return `${rounded} ${unit}`;
  return `0 ${unit} (Unchanged)`;
}
