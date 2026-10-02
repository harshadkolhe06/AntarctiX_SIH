'use client';

import React from 'react';
import { Cpu, ArrowRight, ArrowDown, Database, Cloud, ShieldCheck, WifiOff, HardDrive } from 'lucide-react';

export default function ArchitectureView() {
  return (
    <div className="space-y-6">
      <div className="arctic-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-[#BCE1F4] text-[#2D3436]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-base text-[#2D3436] tracking-tight">
                  TECHNICAL SYSTEM ARCHITECTURE & CONTROL FLOW
                </h2>
                <p className="text-xs text-[#6B7280]">
                  End-to-End Pipeline: Data Ingestion $\rightarrow$ ML Forecasting $\rightarrow$ Derating $\rightarrow$ Priority Allocation $\rightarrow$ Local Buffer
                </p>
              </div>
            </div>
          </div>

          <span className="badge-public">
            EDGE AI ARCHITECTURE
          </span>
        </div>

        {/* Main Pipeline Flow diagram */}
        <div className="p-4 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl mb-6">
          <div className="font-heading font-bold text-xs text-[#2D3436] uppercase tracking-wider mb-4">
            PRIMARY CONTROL & INFERENCE PIPELINE
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-center text-xs font-heading font-bold">
            {/* Step 1 */}
            <div className="p-3 bg-white border border-[#E5E7EB] rounded-lg">
              <Cloud className="w-5 h-5 mx-auto text-[#0284c7] mb-1" />
              <div className="text-[#2D3436]">PUBLIC WEATHER DATA</div>
              <div className="text-[10px] text-[#6B7280] font-normal mt-0.5">NASA POWER API</div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-[#AEE4E5]" />
            </div>

            {/* Step 2 */}
            <div className="p-3 bg-white border border-[#E5E7EB] rounded-lg">
              <HardDrive className="w-5 h-5 mx-auto text-[#0F766E] mb-1" />
              <div className="text-[#2D3436]">EDGE PROCESSING</div>
              <div className="text-[10px] text-[#6B7280] font-normal mt-0.5">FastAPI & Python</div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-[#AEE4E5]" />
            </div>

            {/* Step 3 */}
            <div className="p-3 bg-white border border-[#E5E7EB] rounded-lg">
              <Cpu className="w-5 h-5 mx-auto text-[#8B5CF6] mb-1" />
              <div className="text-[#2D3436]">FORECASTING MODEL</div>
              <div className="text-[10px] text-[#6B7280] font-normal mt-0.5">Random Forest Regressor</div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-[#AEE4E5]" />
            </div>

            {/* Step 4 */}
            <div className="p-3 bg-white border border-[#E5E7EB] rounded-lg">
              <ShieldCheck className="w-5 h-5 mx-auto text-[#10B981] mb-1" />
              <div className="text-[#2D3436]">COLD ADJUSTMENT</div>
              <div className="text-[10px] text-[#6B7280] font-normal mt-0.5">Thermal Derating Engine</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center text-xs font-heading font-bold mt-4">
            {/* Step 5 */}
            <div className="p-3 bg-white border border-[#E5E7EB] rounded-lg">
              <div className="text-[#075985]">SMART ALLOCATION</div>
              <div className="text-[10px] text-[#6B7280] font-normal mt-0.5">Solar → Wind → Battery → Diesel</div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-[#AEE4E5]" />
            </div>

            {/* Step 6 */}
            <div className="p-3 bg-white border border-[#E5E7EB] rounded-lg">
              <div className="text-[#EF4444]">SHORTFALL DETECTOR</div>
              <div className="text-[10px] text-[#6B7280] font-normal mt-0.5">Critical Load Protection</div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-[#AEE4E5]" />
            </div>

            {/* Step 7 */}
            <div className="p-3 bg-[#BCE1F4] border border-[#075985] rounded-lg">
              <div className="text-[#2D3436]">PRAKASH DASHBOARD</div>
              <div className="text-[10px] text-[#2D3436] font-normal mt-0.5">Next.js UI & Decision Trace</div>
            </div>
          </div>
        </div>

        {/* Sub-Path Architectures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Station Sensors & Edge Path */}
          <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl space-y-2 text-xs">
            <div className="font-heading font-bold text-xs text-[#2D3436] uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#0F766E]" /> STATION SENSORS & SCADA PATH
            </div>
            <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB] space-y-1 font-mono text-[11px]">
              <div>STATION SENSORS (Load, SOC, Generator)</div>
              <div className="text-[#6B7280]">↓</div>
              <div>LOCAL EDGE NODE (FastAPI Daemon)</div>
              <div className="text-[#6B7280]">↓</div>
              <div>RULE VALIDATION & ISOLATION FOREST ANOMALY FIT</div>
            </div>
          </div>

          {/* Offline Fallback Path */}
          <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl space-y-2 text-xs">
            <div className="font-heading font-bold text-xs text-[#2D3436] uppercase tracking-wider flex items-center gap-1.5 text-amber-800">
              <WifiOff className="w-4 h-4 text-amber-600" /> OFFLINE FALLBACK RESILIENCE PATH
            </div>
            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 space-y-1 font-mono text-[11px] text-amber-900">
              <div>COMMUNICATION FAILURE (Satellite Link Down)</div>
              <div className="text-amber-600">↓</div>
              <div>LAST KNOWN GOOD SENSOR READINGS & CACHED WEATHER</div>
              <div className="text-amber-600">↓</div>
              <div>LOCAL SQLITE BUFFER QUEUE (`prakash_offline.db`)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
