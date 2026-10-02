'use client';

import React from 'react';
import { Briefcase, Target, ShieldCheck, Zap, Building2, Rocket, ArrowRight } from 'lucide-react';

export default function BusinessView() {
  return (
    <div className="space-y-6">
      <div className="arctic-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-[#BCE1F4] text-[#2D3436]">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-base text-[#2D3436] tracking-tight">
                  BUSINESS & SUSTAINABILITY FRAMEWORK
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Target Beneficiary: National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences (MoES)
                </p>
              </div>
            </div>
          </div>

          <span className="badge-public">
            SOFTWARE-FIRST DEPLOYMENT MODEL
          </span>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Pillar 1: Core Product */}
          <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl space-y-2">
            <div className="p-2 bg-[#BCE1F4]/40 text-[#075985] rounded-lg w-fit">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#2D3436]">1. CORE PRODUCT</h3>
            <div className="text-xs text-[#6B7280] space-y-1">
              <p>• Edge AI energy forecasting platform</p>
              <p>• Cold-weather battery derating engine</p>
              <p>• Deterministic priority allocation engine</p>
              <p>• Shortfall risk prediction & load shedding</p>
            </div>
          </div>

          {/* Pillar 2: Value to NCPOR */}
          <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl space-y-2">
            <div className="p-2 bg-[#AEE4E5]/40 text-[#0F766E] rounded-lg w-fit">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#2D3436]">2. VALUE TO NCPOR / MoES</h3>
            <div className="text-xs text-[#6B7280] space-y-1">
              <p>• 20–40% fuel burn reduction target</p>
              <p>• Improved microgrid stability & thermal reliability</p>
              <p>• Optimized diesel refueling logistics</p>
              <p>• Maxed polar renewable utilization</p>
            </div>
          </div>

          {/* Pillar 3: Deployment Model */}
          <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl space-y-2">
            <div className="p-2 bg-[#B5CBF0]/40 text-[#1E40AF] rounded-lg w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#2D3436]">3. DEPLOYMENT MODEL</h3>
            <div className="text-xs text-[#6B7280] space-y-1">
              <p>• Software-first deployment architecture</p>
              <p>• Interfaces with existing station microgrids</p>
              <p>• Edge node execution (SQLite local buffer)</p>
              <p>• Zero costly hardware retrofits required</p>
            </div>
          </div>

          {/* Pillar 4: Scalability Roadmap */}
          <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl space-y-2">
            <div className="p-2 bg-purple-100 text-[#7C3AED] rounded-lg w-fit">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#2D3436]">4. SCALABILITY ROADMAP</h3>
            <div className="text-xs text-[#6B7280] space-y-1">
              <p>• Phase 1: Bharati Station (Larsemann Hills)</p>
              <p>• Phase 2: Maitri Station (Schirmacher Oasis)</p>
              <p>• Phase 3: Himadri Station (Arctic / Svalbard)</p>
              <p>• Phase 4: Industrial SCADA integration</p>
            </div>
          </div>
        </div>

        {/* Scalability Path Visualization */}
        <div className="p-4 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl">
          <div className="font-heading font-bold text-xs text-[#2D3436] uppercase tracking-wider mb-3">
            MULTI-STATION SCALABILITY PIPELINE
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-heading font-bold">
            <div className="p-3 bg-white border border-[#BCE1F4] rounded-lg flex-1 min-w-[200px] text-center">
              <div className="text-[#075985] font-extrabold">BHARATI STATION</div>
              <div className="text-[11px] text-[#6B7280] font-normal mt-0.5">Larsemann Hills, East Antarctica (-69.408°S)</div>
            </div>

            <ArrowRight className="w-4 h-4 text-[#6B7280] hidden sm:block" />

            <div className="p-3 bg-white border border-[#AEE4E5] rounded-lg flex-1 min-w-[200px] text-center">
              <div className="text-[#0F766E] font-extrabold">MAITRI STATION</div>
              <div className="text-[11px] text-[#6B7280] font-normal mt-0.5">Schirmacher Oasis, East Antarctica (-70.766°S)</div>
            </div>

            <ArrowRight className="w-4 h-4 text-[#6B7280] hidden sm:block" />

            <div className="p-3 bg-white border border-[#B5CBF0] rounded-lg flex-1 min-w-[200px] text-center">
              <div className="text-[#1E40AF] font-extrabold">HIMADRI & ARCTIC STATIONS</div>
              <div className="text-[11px] text-[#6B7280] font-normal mt-0.5">Ny-Ålesund, Svalbard, Arctic Circle (+78.923°N)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
