'use client';

import React from 'react';
import { Bot, CheckCircle2, AlertTriangle, ShieldCheck, ArrowUpRight, Flame } from 'lucide-react';

export default function AiEnergyStatusCard({ telemetry }) {
  if (!telemetry) return null;

  const allocation = telemetry.allocation || {};
  const shortfallRisk = telemetry.shortfall_risk || {};
  const batterySoc = telemetry.battery_derating?.soc_percent ?? 78;
  const renewableShare = allocation.renewable_share_pct ?? 53;
  const dieselUsed = allocation.diesel_used_kw || 0;

  const status = shortfallRisk.status || 'NORMAL';
  
  const getStatusBadge = () => {
    if (status === 'SHORTFALL RISK') {
      return {
        label: 'CRITICAL SHORTFALL',
        subtext: 'Immediate energy deficit risk predicted within lead window.',
        color: 'text-[#EF4444]',
        bg: 'bg-[#EF4444]/10 border-[#EF4444]/30',
        icon: AlertTriangle
      };
    } else if (status === 'WATCH') {
      return {
        label: 'WATCH CONDITION',
        subtext: 'High demand or low renewable generation threshold approaching.',
        color: 'text-[#F59E0B]',
        bg: 'bg-[#F59E0B]/10 border-[#F59E0B]/30',
        icon: AlertTriangle
      };
    }
    return {
      label: 'SYSTEM STABLE',
      subtext: 'No immediate energy shortfall predicted for station loads.',
      color: 'text-[#10B981]',
      bg: 'bg-[#10B981]/10 border-[#10B981]/30',
      icon: CheckCircle2
    };
  };

  const statusMeta = getStatusBadge();
  const StatusIcon = statusMeta.icon;

  const recommendationText = allocation.recommended_primary_source
    ? `Prioritize ${allocation.recommended_primary_source} generation and preserve battery reserve.`
    : "Prioritize renewable generation and preserve battery reserve.";

  return (
    <div className="arctic-card p-5 h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#8B5CF6]/15 text-[#8B5CF6]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-sm text-[#2D3436] tracking-tight uppercase">
                AI ENERGY STATUS
              </h3>
              <p className="text-[11px] text-[#6B7280]">
                Real-Time Inference Engine
              </p>
            </div>
          </div>

          <span className="badge-simulated">
            AI AGENT
          </span>
        </div>

        {/* System Status Banner */}
        <div className={`p-3.5 rounded-xl border mb-4 flex items-start space-x-3 ${statusMeta.bg}`}>
          <StatusIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${statusMeta.color}`} />
          <div>
            <div className={`font-heading font-extrabold text-xs tracking-wider uppercase ${statusMeta.color}`}>
              ● {statusMeta.label}
            </div>
            <p className="text-[11px] text-[#2D3436] mt-0.5 leading-snug">
              {statusMeta.subtext}
            </p>
          </div>
        </div>

        {/* Core Summary Metrics */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center justify-between p-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg">
            <span className="text-xs font-semibold text-[#6B7280]">Renewable Share</span>
            <div className="flex items-center space-x-1.5">
              <div className="w-20 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div className="bg-[#10B981] h-full" style={{ width: `${renewableShare}%` }} />
              </div>
              <span className="telemetry-num text-xs font-bold text-[#10B981]">{renewableShare}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg">
            <span className="text-xs font-semibold text-[#6B7280]">Battery Capacity</span>
            <span className="telemetry-num text-xs font-bold text-[#075985]">{batterySoc}%</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg">
            <span className="text-xs font-semibold text-[#6B7280]">Diesel Generator</span>
            <span className={`text-xs font-bold font-heading ${dieselUsed > 0 ? 'text-[#EF4444]' : 'text-[#6B7280]'}`}>
              {dieselUsed > 0 ? `Active (${dieselUsed} kW)` : 'Standby'}
            </span>
          </div>
        </div>

        {/* AI Recommendation Box */}
        <div className="p-3 bg-[#BCE1F4]/20 border border-[#a5d5ef]/60 rounded-xl">
          <div className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#075985] mb-1 flex items-center justify-between">
            <span>RECOMMENDATION:</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs font-medium text-[#2D3436] italic leading-relaxed">
            "{recommendationText}"
          </p>
        </div>
      </div>

      {/* Decision Reason Trace */}
      {allocation.decision_reason && (
        <div className="mt-4 pt-3 border-t border-[#E5E7EB] text-[10px] text-[#6B7280]">
          <span className="font-bold text-[#2D3436]">Allocation Trace:</span> {allocation.decision_reason}
        </div>
      )}
    </div>
  );
}
