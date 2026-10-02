'use client';

import React, { useState } from 'react';
import { Radio, Flame, Cpu, Droplet, Building, Activity, X, Thermometer, Wind, Sun, Battery, Gauge } from 'lucide-react';

export default function DigitalTwinStationView({ station, telemetry, onStationChange }) {
  const [selectedModule, setSelectedModule] = useState(null);

  if (!station || !telemetry) return null;

  const weather = telemetry.weather || {};
  const currentSolar = telemetry.current_solar_kw || 0;
  const currentWind = telemetry.current_wind_kw || 0;
  const batterySoc = telemetry.battery_derating?.soc_percent || 78;
  const fuelReserve = station.diesel_fuel_reserve_l || 50000;
  const fuelPct = ((fuelReserve / 60000) * 100).toFixed(0);

  const modules = [
    {
      id: 'gen',
      name: 'Generator Facility',
      icon: Flame,
      status: telemetry.generator_health?.status || 'HEALTHY',
      output: `${telemetry.generator_health?.effective_capacity_kw || station.diesel_generator_rated_kw} kW`,
      load: `${((telemetry.allocation?.diesel_used_kw / (station.diesel_generator_rated_kw || 1)) * 100).toFixed(0)}%`,
      health: telemetry.generator_health?.status === 'HEALTHY' ? 'NORMAL' : 'DEGRADED',
      description: 'Primary diesel generator powerhouse providing firm backup power.'
    },
    {
      id: 'fuel',
      name: 'Fuel Storage Tanks',
      icon: Flame,
      status: 'NORMAL',
      output: `${(fuelReserve / 1000).toFixed(1)}k Litres (${fuelPct}%)`,
      load: `${telemetry.allocation?.fuel_consumption_lph || 0} L/h`,
      health: 'SEALED ARCTIC TANKS',
      description: 'Polar diesel fuel reserve storage tanks.'
    },
    {
      id: 'hvac',
      name: 'Thermal Heating Loop',
      icon: Cpu,
      status: 'NORMAL',
      output: `${telemetry.allocation?.critical_demand_kw || 0} kW`,
      load: '65% Priority',
      health: 'OPERATIONAL',
      description: 'Thermal glycol heating system maintaining station quarters.'
    },
    {
      id: 'water',
      name: 'Desalination Plant',
      icon: Droplet,
      status: 'NORMAL',
      output: '2,400 L/Day',
      load: '12 kW',
      health: 'OPTIMAL',
      description: 'Reverse osmosis water purification system.'
    },
    {
      id: 'comms',
      name: 'Satellite Array',
      icon: Radio,
      status: telemetry.offline_mode ? 'OFFLINE' : 'ONLINE',
      output: telemetry.offline_mode ? '0 Kbps (Local Buffer)' : '45 Mbps',
      load: '4.5 kW',
      health: telemetry.offline_mode ? 'DEGRADED' : 'STABLE',
      description: 'Satellite comms transmitting encrypted telemetry to NCPOR.'
    },
    {
      id: 'quarters',
      name: 'Living Quarters',
      icon: Building,
      status: 'NORMAL',
      output: `${telemetry.allocation?.non_critical_demand_kw || 0} kW`,
      load: 'Nominal',
      health: 'NORMAL',
      description: 'Main laboratory and residential quarters.'
    }
  ];

  return (
    <div className="arctic-card p-5 flex flex-col justify-between h-full">
      <div>
        {/* Card Header & Station Tabs */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB]">
          <div>
            <h3 className="font-heading font-bold text-sm text-[#2D3436] tracking-tight">
              STATION ENERGY STATE
            </h3>
            <p className="text-[11px] text-[#6B7280]">
              {station.name} ({station.location})
            </p>
          </div>

          {/* Station Selector */}
          <div className="inline-flex bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-0.5">
            <button
              onClick={() => onStationChange('BHARATI')}
              className={`px-3 py-1 rounded-md font-heading font-bold text-xs transition-all ${
                station.id === 'BHARATI'
                  ? 'bg-[#BCE1F4] text-[#2D3436] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#2D3436]'
              }`}
            >
              BHARATI
            </button>
            <button
              onClick={() => onStationChange('MAITRI')}
              className={`px-3 py-1 rounded-md font-heading font-bold text-xs transition-all ${
                station.id === 'MAITRI'
                  ? 'bg-[#BCE1F4] text-[#2D3436] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#2D3436]'
              }`}
            >
              MAITRI
            </button>
          </div>
        </div>

        {/* Compact 2-Column Metric Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
            <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-[#0284c7]" /> Temperature
            </div>
            <div className="telemetry-num text-base font-bold text-[#2D3436] mt-0.5">
              {weather.temperature_c}°C
            </div>
          </div>

          <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
            <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-[#0284c7]" /> Wind
            </div>
            <div className="telemetry-num text-base font-bold text-[#2D3436] mt-0.5">
              {(weather.wind_speed_ms * 3.6).toFixed(0)} km/h <span className="text-xs text-[#6B7280]">({weather.wind_speed_ms} m/s)</span>
            </div>
          </div>

          <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
            <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-[#F59E0B]" /> Solar Output
            </div>
            <div className="telemetry-num text-base font-bold text-[#F59E0B] mt-0.5">
              {currentSolar} kW
            </div>
          </div>

          <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
            <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-[#0284c7]" /> Wind Power
            </div>
            <div className="telemetry-num text-base font-bold text-[#0284c7] mt-0.5">
              {currentWind} kW
            </div>
          </div>

          <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
            <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-[#10B981]" /> Battery SOC
            </div>
            <div className="telemetry-num text-base font-bold text-[#10B981] mt-0.5">
              {batterySoc}%
            </div>
          </div>

          <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
            <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#F59E0B]" /> Fuel Reserve
            </div>
            <div className="telemetry-num text-base font-bold text-[#2D3436] mt-0.5">
              {(fuelReserve / 1000).toFixed(1)}k L
            </div>
          </div>
        </div>

        {/* Spatial Station Digital Twin Schematic Canvas */}
        <div className="station-canvas-bg border border-[#E5E7EB] rounded-xl p-3 flex-1 min-h-[220px] relative">
          <div className="text-[10px] font-heading font-bold text-[#6B7280] uppercase tracking-wider mb-2">
            SPATIAL INFRASTRUCTURE SCHEMATIC (CLICK TO INSPECT)
          </div>

          <div className="grid grid-cols-2 gap-2">
            {modules.map((mod) => {
              const isSelected = selectedModule?.id === mod.id;
              const Icon = mod.icon;
              const isDegraded = mod.status.includes('DEGRADED') || mod.status.includes('OFFLINE');

              return (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModule(mod)}
                  className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#BCE1F4] border-[#075985] ring-2 ring-[#075985]/20 shadow-sm'
                      : isDegraded
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-white/90 border-[#E5E7EB] hover:border-[#BCE1F4]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Icon className="w-3.5 h-3.5 text-[#2D3436]" />
                    <span className={`text-[9px] font-heading font-bold px-1 py-0.5 rounded ${
                      isDegraded ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {mod.status}
                    </span>
                  </div>
                  <div className="font-heading font-bold text-xs text-[#2D3436] truncate">
                    {mod.name}
                  </div>
                  <div className="telemetry-num text-[10px] text-[#6B7280]">
                    {mod.output}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Module Inspector Drawer */}
      {selectedModule && (
        <div className="mt-3 p-3 bg-white border border-[#BCE1F4] rounded-lg shadow-sm text-xs animate-fadeIn">
          <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-[#E5E7EB]">
            <span className="font-heading font-bold text-[#2D3436] flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-[#0284c7]" />
              {selectedModule.name} Inspection
            </span>
            <button onClick={() => setSelectedModule(null)} className="text-[#6B7280] hover:text-[#2D3436]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-[11px] text-[#6B7280]">
            Output: <span className="telemetry-num font-bold text-[#2D3436]">{selectedModule.output}</span> | Health: <span className="font-bold text-[#2D3436]">{selectedModule.health}</span>
          </div>
        </div>
      )}
    </div>
  );
}
