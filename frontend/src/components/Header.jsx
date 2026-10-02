'use client';

import React from 'react';
import { Compass, Play, Pause, RefreshCw } from 'lucide-react';

export default function Header({
  activeTab,
  onTabChange,
  activeStationId,
  onStationChange,
  offlineMode,
  pendingSyncCount,
  onSync,
  riskStatus,
  isSimulationMode,
  isDemoRunning,
  onToggleDemo
}) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'station', label: 'Station' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'energy', label: 'Energy' },
    { id: 'whatif', label: 'What-If' },
  ];

  const getRiskBadge = () => {
    if (riskStatus === 'SHORTFALL RISK') {
      return { label: 'CRITICAL 78.5%', bg: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30' };
    } else if (riskStatus === 'WATCH') {
      return { label: 'WATCH 42.0%', bg: 'bg-[#F59E0B]/15 text-[#B45309] border-[#F59E0B]/30' };
    }
    return { label: 'RISK 12.0%', bg: 'bg-[#10B981]/15 text-[#047857] border-[#10B981]/30' };
  };

  const riskBadge = getRiskBadge();

  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
      {/* 64px Top Navigation Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Title */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#BCE1F4] border border-[#a5d5ef] flex items-center justify-center text-[#2D3436] shadow-sm">
            <Compass className="w-5 h-5 text-[#2D3436]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-heading font-extrabold text-base tracking-tight text-[#2D3436]">
                PRAKASH
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-heading font-bold text-[#6B7280] tracking-wider uppercase">
                AI-DRIVEN POLAR ENERGY INTELLIGENCE
              </span>
            </div>
          </div>
        </div>

        {/* Center: Nav Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-1.5 rounded-full font-heading text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#BCE1F4] text-[#2D3436] font-bold shadow-sm'
                    : 'text-[#6B7280] font-semibold hover:text-[#2D3436] hover:bg-[#F8F9FA]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Station Switcher & Status Badges */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Station Switcher */}
          <div className="inline-flex bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-0.5">
            <button
              onClick={() => onStationChange('BHARATI')}
              className={`px-3 py-1 rounded-md font-heading font-bold text-xs transition-all ${
                activeStationId === 'BHARATI'
                  ? 'bg-[#BCE1F4] text-[#2D3436] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#2D3436]'
              }`}
            >
              BHARATI
            </button>
            <button
              onClick={() => onStationChange('MAITRI')}
              className={`px-3 py-1 rounded-md font-heading font-bold text-xs transition-all ${
                activeStationId === 'MAITRI'
                  ? 'bg-[#BCE1F4] text-[#2D3436] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#2D3436]'
              }`}
            >
              MAITRI
            </button>
          </div>

          {/* Connection Status Badge */}
          <div className={`px-3 py-1 rounded-full text-[11px] font-heading font-bold border flex items-center space-x-1.5 ${
            offlineMode
              ? 'bg-[#F59E0B]/15 text-[#B45309] border-[#F59E0B]/30'
              : 'bg-[#10B981]/15 text-[#047857] border-[#10B981]/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${offlineMode ? 'bg-[#F59E0B] animate-ping' : 'bg-[#10B981]'}`} />
            <span>{offlineMode ? 'OFFLINE' : 'CONNECTED'}</span>
          </div>

          {/* Pending Sync Button */}
          {pendingSyncCount > 0 && (
            <button
              onClick={onSync}
              className="px-2.5 py-1 bg-[#F59E0B] hover:bg-[#d97706] text-white font-heading font-bold text-[11px] rounded-full transition-colors flex items-center space-x-1 shadow-sm"
              title="Click to sync offline telemetry"
            >
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>{pendingSyncCount} SYNC</span>
            </button>
          )}

          {/* Risk Badge */}
          <div className={`px-3 py-1 rounded-full text-[11px] font-heading font-bold border ${riskBadge.bg}`}>
            {riskBadge.label}
          </div>

          {/* Simulated Prototype Badge */}
          <div className="hidden lg:inline-flex badge-simulated">
            SIMULATED PROTOTYPE
          </div>

          {/* Demo Autopilot Button */}
          <button
            onClick={onToggleDemo}
            className={`btn-iceberg px-3.5 py-1.5 text-xs shadow-sm ${
              isDemoRunning ? 'bg-[#EF4444] text-white hover:bg-red-700 animate-pulse border-red-600' : ''
            }`}
          >
            {isDemoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden sm:inline">{isDemoRunning ? 'PAUSE DEMO' : 'LIVE DEMO 60s'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
