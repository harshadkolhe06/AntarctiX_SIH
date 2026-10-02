'use client';

import React from 'react';
import { Gauge, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function GeneratorCard({ generatorHealth }) {
  if (!generatorHealth) return null;

  const {
    status,
    health_factor,
    rated_capacity_kw,
    effective_capacity_kw,
    engine_temp_c,
    load_factor,
    anomaly_score,
    reasons,
    explanation,
    badge
  } = generatorHealth;

  const isDegraded = status === 'DEGRADED';

  return (
    <div className="arctic-card p-4 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#E5E7EB]">
          <div>
            <h3 className="font-heading font-bold text-xs text-[#2D3436] tracking-wider uppercase flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#8B5CF6]" />
              GENERATOR HEALTH & ISOLATION FOREST ANOMALY MODEL
            </h3>
            <p className="text-[11px] text-[#6B7280]">
              Monitors thermodynamic anomalies and dynamically adjusts available generator capacity
            </p>
          </div>

          <span className="badge-simulated">
            ISOLATION FOREST MODEL
          </span>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
            isDegraded ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="text-[10px] font-heading font-bold uppercase opacity-75">Status</div>
            <div className="font-heading font-bold text-sm flex items-center gap-1 my-0.5">
              {isDegraded ? <AlertTriangle className="w-4 h-4 text-[#EF4444]" /> : <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
              {status}
            </div>
            <div className="telemetry-num text-[10px] font-bold opacity-80">{(health_factor * 100).toFixed(0)}% Health</div>
          </div>

          <div className="p-2.5 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
            <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase">Effective Output</div>
            <div className="telemetry-num text-sm font-bold text-[#2D3436] mt-0.5">{effective_capacity_kw} kW</div>
            <div className="text-[10px] text-[#6B7280]">Rated: <span className="telemetry-num">{rated_capacity_kw}</span> kW</div>
          </div>

          <div className="p-2.5 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
            <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase">Engine Temp</div>
            <div className="telemetry-num text-sm font-bold text-[#2D3436] mt-0.5">{engine_temp_c}°C</div>
            <div className="text-[10px] text-[#6B7280]">Load: <span className="telemetry-num">{(load_factor * 100).toFixed(0)}%</span></div>
          </div>

          <div className="p-2.5 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
            <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase">Anomaly Score</div>
            <div className={`telemetry-num text-sm font-bold mt-0.5 ${isDegraded ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
              {anomaly_score}
            </div>
            <div className="text-[10px] text-[#6B7280]">Norm Cutoff: -0.55</div>
          </div>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="p-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-xs text-[#6B7280]">
        <span className="font-heading font-bold text-[#2D3436]">IsolationForest Diagnostic: </span>
        {explanation}
      </div>
    </div>
  );
}
