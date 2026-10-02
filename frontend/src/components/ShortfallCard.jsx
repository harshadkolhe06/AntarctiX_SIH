'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock, AlertOctagon, ListChecks } from 'lucide-react';

export default function ShortfallCard({ shortfallRisk }) {
  if (!shortfallRisk) return null;

  const {
    status,
    color,
    status_label,
    expected_in_hours,
    estimated_deficit_kw,
    affected_load,
    reasons,
    recommended_actions
  } = shortfallRisk;

  const isCritical = status === 'SHORTFALL RISK';
  const isWatch = status === 'WATCH';
  const isNormal = status === 'NORMAL';

  return (
    <div className={`rounded-xl border p-5 shadow-sm mb-6 transition-all ${
      isCritical
        ? 'bg-red-500/10 border-red-500/40 text-red-950'
        : isWatch
        ? 'bg-amber-500/10 border-amber-500/40 text-amber-950'
        : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950'
    }`}>
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-current/10">
        <div className="flex items-center space-x-3">
          {isCritical ? (
            <div className="p-2.5 bg-red-600 text-white rounded-xl shadow animate-bounce">
              <AlertOctagon className="w-6 h-6" />
            </div>
          ) : isWatch ? (
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl shadow">
              <AlertTriangle className="w-6 h-6" />
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow">
              <CheckCircle className="w-6 h-6" />
            </div>
          )}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-70">
              AI SHORTFALL PREDICTION DETECTOR
            </div>
            <h3 className="text-lg font-extrabold tracking-tight">
              {status_label}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
            isCritical
              ? 'bg-red-600 text-white border-red-700'
              : isWatch
              ? 'bg-amber-500 text-slate-950 border-amber-600'
              : 'bg-emerald-600 text-white border-emerald-700'
          }`}>
            STATUS: {status}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-white/80 rounded-lg border border-current/10">
          <div className="text-[11px] font-semibold opacity-70 flex items-center gap-1 uppercase">
            <Clock className="w-3.5 h-3.5" /> Expected In
          </div>
          <div className="text-base font-bold text-slate-900 mt-0.5">{expected_in_hours}</div>
        </div>

        <div className="p-3 bg-white/80 rounded-lg border border-current/10">
          <div className="text-[11px] font-semibold opacity-70 uppercase">Estimated Deficit</div>
          <div className="text-base font-bold text-slate-900 mt-0.5">{estimated_deficit_kw} kW</div>
        </div>

        <div className="p-3 bg-white/80 rounded-lg border border-current/10">
          <div className="text-[11px] font-semibold opacity-70 uppercase">Affected Load</div>
          <div className="text-base font-bold text-slate-900 mt-0.5 truncate">{affected_load}</div>
        </div>
      </div>

      {/* Reasons & Recommended Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Cause / Reason */}
        <div className="p-3 bg-white/80 rounded-lg border border-current/10 space-y-1">
          <div className="font-bold text-slate-900 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Cause / Diagnostics:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-700">
            {reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        {/* Recommended Actions */}
        <div className="p-3 bg-white/80 rounded-lg border border-current/10 space-y-1">
          <div className="font-bold text-slate-900 flex items-center gap-1">
            <ListChecks className="w-3.5 h-3.5 text-cyan-600" /> Recommended Action Plan:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-700">
            {recommended_actions.map((act, i) => (
              <li key={i}>{act}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
