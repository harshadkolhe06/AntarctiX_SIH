'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, AlertOctagon, Info, Cpu } from 'lucide-react';

export default function RiskEnginePanel({ shortfallRisk, telemetry }) {
  if (!telemetry) return null;

  const shortfall = shortfallRisk || telemetry.shortfall_risk || {};
  const status = shortfall.status || 'NORMAL';
  
  const isCritical = status === 'SHORTFALL RISK';
  const isWatch = status === 'WATCH';

  const riskScorePct = isCritical ? 78.5 : (isWatch ? 42.0 : 12.0);
  const riskColorClass = isCritical ? 'text-[#EF4444]' : (isWatch ? 'text-[#F59E0B]' : 'text-[#10B981]');
  const riskBgClass = isCritical ? 'bg-red-50 border-red-200' : (isWatch ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200');

  const conditions = [
    {
      label: 'Renewable generation available',
      met: (telemetry.current_solar_kw + telemetry.current_wind_kw) > 0,
    },
    {
      label: 'Battery usable reserve available',
      met: (telemetry.battery_derating?.effective_usable_capacity_kwh || 0) > 20,
    },
    {
      label: 'Generator thermodynamic health',
      met: telemetry.generator_health?.status === 'HEALTHY',
    },
    {
      label: 'Critical life-support load covered',
      met: telemetry.allocation?.critical_load_met ?? true,
    }
  ];

  return (
    <div className="arctic-card p-4 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-3">
          <h3 className="font-heading font-bold text-xs text-[#2D3436] tracking-wider uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0284c7]" />
            AI RISK ENGINE & CONTROL RECOMMENDATIONS
          </h3>
          <span className="badge-simulated">
            REAL-TIME GUARDIAN
          </span>
        </div>

        {/* Risk Score Indicator */}
        <div className={`p-4 rounded-xl border ${riskBgClass} mb-4 text-center`}>
          <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase tracking-wider">
            SYSTEM RISK EVALUATION SCORE
          </div>
          <div className={`telemetry-num text-3xl font-extrabold my-1 ${riskColorClass}`}>
            {riskScorePct.toFixed(1)}%
          </div>
          <div className={`font-heading font-bold text-xs uppercase tracking-wide ${riskColorClass}`}>
            {status === 'NORMAL' ? 'LOW RISK' : shortfall.status_label}
          </div>
          <div className="text-[11px] text-[#6B7280] mt-1 font-mono">
            {shortfall.expected_in_hours}
          </div>
        </div>

        {/* Active Conditions Checklist */}
        <div className="mb-4">
          <div className="text-[11px] font-heading font-bold text-[#6B7280] uppercase tracking-wider mb-2">
            ACTIVE INFRASTRUCTURE CONDITIONS
          </div>
          <div className="space-y-1.5 text-xs">
            {conditions.map((cond, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB]">
                <span className="text-[#2D3436] font-medium">{cond.label}</span>
                {cond.met ? (
                  <span className="font-heading font-bold text-[#10B981] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> MET
                  </span>
                ) : (
                  <span className="font-heading font-bold text-[#EF4444] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> RISK
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendation Box */}
      <div className="p-3 bg-[#BCE1F4]/30 border border-[#BCE1F4] rounded-lg text-xs">
        <div className="font-heading font-bold text-[#2D3436] mb-1 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-[#0284c7]" /> AI OPERATIONAL RECOMMENDATION
        </div>
        <p className="text-[#6B7280] leading-relaxed">
          {status === 'NORMAL'
            ? "Maintain renewable-first priority allocation. Battery storage contribution is optimal. No diesel escalation required."
            : shortfall.recommended_actions?.[0] || "Prepare backup diesel generator units for immediate auto-start and shed non-critical research loads."}
        </p>
      </div>
    </div>
  );
}
