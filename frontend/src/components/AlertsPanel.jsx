'use client';

import React from 'react';
import { Bell, AlertTriangle, Info, ShieldAlert } from 'lucide-react';

export default function AlertsPanel({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="arctic-card p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-heading font-bold text-xs text-[#2D3436] uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-[#6B7280]" />
            REAL-TIME SYSTEM ALERTS (0)
          </h3>
        </div>
        <p className="text-xs text-[#6B7280] italic">No active system alarms. Station energy grid operating within normal parameters.</p>
      </div>
    );
  }

  return (
    <div className="arctic-card p-4 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E7EB]">
          <h3 className="font-heading font-bold text-xs text-[#2D3436] uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-[#F59E0B]" />
            REAL-TIME SYSTEM ALERTS & ALARMS ({alerts.length})
          </h3>
          <span className="badge-simulated">
            PRIORITY DISPATCH FEED
          </span>
        </div>

        <div className="space-y-2.5">
          {alerts.map((alt, idx) => {
            const isCritical = alt.type === 'critical';
            const isWarning = alt.type === 'warning';
            
            return (
              <div
                key={alt.id || idx}
                className={`p-3 rounded-lg border flex items-start space-x-2.5 transition-all text-xs ${
                  isCritical
                    ? 'bg-red-50 border-red-200 text-red-950'
                    : isWarning
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-blue-50 border-blue-200 text-blue-950'
                }`}
              >
                {isCritical ? (
                  <ShieldAlert className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                ) : isWarning ? (
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-[#0284c7] flex-shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-heading font-bold text-[#2D3436] text-xs">{alt.title}</h4>
                    <span className="text-[10px] font-heading font-bold px-1.5 py-0.5 rounded bg-white border border-[#E5E7EB] text-[#6B7280]">
                      {alt.badge || 'SYSTEM'}
                    </span>
                  </div>
                  <p className="text-[#6B7280] text-[11px] mt-0.5 leading-relaxed">{alt.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
