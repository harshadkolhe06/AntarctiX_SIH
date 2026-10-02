'use client';

import React from 'react';
import { Briefcase, Target, ShieldCheck, Zap, Building2, Rocket } from 'lucide-react';

export default function BusinessSection() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-cyan-600" />
            BUSINESS, SUSTAINABILITY & DEPLOYMENT ARCHITECTURE
          </h3>
          <p className="text-xs text-slate-500">
            Strategic Roadmap & Operational Value Proposition for NCPOR Polar Stations
          </p>
        </div>

        <span className="polar-badge bg-blue-100 text-blue-800 border border-blue-200">
          SOFTWARE-FIRST DEPLOYMENT MODEL
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Core Product */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-600" /> Core Product
          </div>
          <div className="text-xs font-bold text-slate-900">Edge AI Energy Optimization Platform</div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Software suite combining ML renewable forecasting, cold battery derating models, and deterministic priority allocation.
          </p>
        </div>

        {/* Target Organization */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-blue-600" /> Target Beneficiary
          </div>
          <div className="text-xs font-bold text-slate-900">NCPOR / Indian Polar Stations</div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences (MoES), Bharati & Maitri Stations.
          </p>
        </div>

        {/* Quantified Impact Value */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Key Value Drivers
          </div>
          <div className="text-xs font-bold text-slate-900">20–40% Fuel Burn Reduction</div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Mitigates avoidable diesel consumption, extends battery pack lifespan, and protects critical life-support heating loads.
          </p>
        </div>

        {/* Future Integration */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <Rocket className="w-3.5 h-3.5 text-purple-600" /> Scalability & Future
          </div>
          <div className="text-xs font-bold text-slate-900">NCPOR SCADA & Sensor Integration</div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Future phases to connect live SCADA telemetry, industrial IoT sensors, and expand to Arctic research stations (Himadri).
          </p>
        </div>
      </div>

      <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-lg text-xs text-blue-900 flex items-center justify-between">
        <div>
          <span className="font-bold">Deployment Disclosure: </span>
          PRAKASH is designed for software-first edge deployment on existing polar station computing infrastructure without requiring costly hardware retrofits.
        </div>
        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-200 text-blue-900">
          SIH Prototype Status
        </span>
      </div>
    </div>
  );
}
